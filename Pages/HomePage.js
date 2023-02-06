import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from '../firebase';
import { Ionicons, Entypo } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import Swiper from 'react-native-deck-swiper';
import { onSnapshot, getFirestore, doc, collection, setDoc, getDocs, query, where, getDoc } from "firebase/firestore";

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

                const likes = await getDocs(collection(db, 'users', user.uid, 'likes')).then
                    ((snapshot) => snapshot.docs.map((doc) => doc.id)
                );

                const passedUserIds = passes.length > 0 ? passes : ["test"];
                const likedUserIds = likes.length > 0 ? likes : ["test"];

                unsubscribe = onSnapshot(
                    query(
                        collection(db, 'users'),
                        where('uid', 'not-in', [...passedUserIds, ...likedUserIds])
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
        if (!profiles[cardIndex]) return;

        const userSwiped = profiles[cardIndex];
        const loggedInUser = await (
            await getDoc(db, 'users', user.uid)
        ).data();

        //Make checking match a cloud function later

        getDoc(doc(db, 'users', userSwiped.id, 'swipes', user.uid)).then(
            (documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    //Other user has already swiped yes on you, create a match!
                    console.log("It's a match!");

                    setDoc(doc(db, 'users', user.uid, 'likes', userSwiped.uid),
                    {
                        uid: userSwiped.uid,
                        firstName: userSwiped.firstName,
                        age: userSwiped.age,
                    });

                    //Match
                    

                } else {
                    //Other user has not swiped yes yet, create a new doc in likes 
                    console.log(`You swiped YES on ${userSwiped.firstName}`);

                    setDoc(doc(db, 'users', user.uid, 'likes', userSwiped.uid),
                    {
                        uid: userSwiped.uid,
                        firstName: userSwiped.firstName,
                        age: userSwiped.age,
                    });
                }
            }
        );
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
                    stackSize={5}
                    cardIndex={0}
                    animateCardOpacity
                    verticalSwipe={false}
                    onSwipedLeft={(cardIndex) => {
                        swipeLeft(cardIndex);
                    }}
                    onSwipedRight={(cardIndex) => {
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
                    renderCard={(card) => card ? (
                            <View key={card.uid} className="relative bg-white h-3/4 rounded-xl">
                                <View className="top-0 h-1/2 w-full rounded-xl">
                                    <FlatList 
                                        data={card.images} 
                                        renderItem={(item) => {
                                            return (
                                                <View className="rounded-xl">
                                                    <Image className="w-96 h-full self-center rounded-t-xl" source={{uri: item.item.url}} />
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
                            <View className="bg-white h-3/4 rounded-xl justify-center items-center" style={style.cardShadow}>
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

const style = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    }
})