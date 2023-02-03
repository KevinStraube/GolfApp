import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TouchableOpacity } from "react-native";
import { auth } from '../firebase';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import Swiper from 'react-native-deck-swiper';
import { onSnapshot, getFirestore, doc, collection, setDoc, getDocs, query, where } from "firebase/firestore";

const db = getFirestore();

const HomePage = () => {
    const swipeRef = useRef(null);
    const [profiles, setProfiles] = useState([]);

    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log("User not yet loaded");
        } else {
            let unsubscribe;

            const fetchCards = async () => {
            
                const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then
                    ((snapshot) => snapshot.docs.map((doc) => doc.id)
                );

                const passedUserIds = passes.length > 0 ? passes : ["test"];

                unsubscribe = onSnapshot(
                    query(
                        collection(db, 'users'),
                        where('uid', 'not-in', [...passedUserIds])
                    ),
                    (snapshot) => {
                        setProfiles(
                            snapshot.docs.filter((doc) => doc.id !== user.uid)
                            .map((doc) => ({
                                id: doc.id,
                                ...doc.data()
                            }
                        ))
                    );
                });
            };
    
            fetchCards();
            
            console.log(profiles);
    
            return unsubscribe;
        }
    }, [user])

    const swipeLeft = (cardIndex) => {
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        console.log(`You swiped NEXT on ${userSwiped.firstName}`);

        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.uid),
        {
            uid: userSwiped.uid,
            firstName: userSwiped.firstName,
            age: userSwiped.age,
        });
    };

    const swipeRight = async (cardIndex) => {

    }; 

    return (
        <SafeAreaView className="flex-1">
            <Image
                className="h-14 w-14 self-center"
                source={require('../assets/TransparentLogo.png')}
            />
            {/* Profile Cards */}
            <View className="flex-1 -mt-10 ">
                <Swiper
                    ref={swipeRef}
                    containerStyle={{ backgroundColor: "transparent" }}
                    cards={profiles}
                    cardIndex={0}
                    stackSize={5}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        console.log("Swiped next");
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
                        console.log("Swiped yes");
                        swipeRight(cardIndex);
                    }}
                    overlayLabels={{
                        left: {
                            title: "NEXT",
                            style: {
                                label: {
                                    textAlign: "right",
                                    color: "red"
                                },
                            },
                        },
                        right: {
                            title: "YES",
                            style: {
                                label: {
                                    textAlign: "left",
                                    color: "green"
                                },
                            },
                        },
                    }}
                    renderCard={card => card ? (
                            <View key={card.id} className="bg-white h-3/4 rounded-xl">
                                <View className="top-0 h-1/2 w-full rounded-xl">
                                    <FlatList 
                                        data={card.images} 
                                        renderItem={(item) => {
                                            return (
                                                <View className="">
                                                    <Image className="w-96 h-full self-center" source={{uri: item.item.url}} />
                                                </View>
                                            )
                                        }}
                                        keyExtractor={item => item.id}
                                        horizontal
                                        pagingEnabled
                                        showsHorizontalScrollIndicator={false}
                                    />
                                </View>    
                                <View className="bg-white w-full h-20 rounded-b-xl">
                                    <View>
                                        <Text className="font-bold">{card.firstName}, {card.age}</Text>
                                        
                                    </View>
                                    <View>
                                        <Text>{card.city}</Text>
                                        <Text>Playstyle: {card.playStyle}</Text>
                                        <Text>Handicap: {card.handicap}</Text>
                                        <Text>What are you doing after a round?</Text>
                                        <Text>{card.afterRound}</Text>
                                    </View>
                                </View>
                            </View>
                        ) : (
                            <View className="relative bg-white h-3/4 rounded-xl justify-center items-center">
                                <Text className="font-bold pb-5">No more profiles!</Text>
                                <Text>Please try again later</Text>
                            </View>
                        )
                    }
                />
            </View>
            <View className="flex flex-row justify-between mb-3 mx-10">
                <TouchableOpacity 
                    className="items-center justify-center rounded-full w-16 h-16 bg-red-200"
                    onPress={() => swipeRef.current.swipeLeft()}
                >
                    <Entypo name="cross" size={24} color="red"/>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="items-center justify-center rounded-full w-16 h-16 bg-green-200"
                    onPress={() => swipeRef.current.swipeRight()}
                >
                    <Ionicons name="checkmark" size={24} color="green"/>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default HomePage;