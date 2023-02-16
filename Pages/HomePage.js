import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { auth } from '../firebase';
import { AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useAuth } from '../hooks/useAuth';
import { onSnapshot, getFirestore, doc, collection, setDoc, getDocs, query, where, getDoc, serverTimestamp } from "firebase/firestore";
import generateId from '../lib/generateId';

const db = getFirestore();

const HomePage = ({ navigation }) => {
    const [profiles, setProfiles] = useState([]);
    const [filteredProfiles, setFilteredProfiles] = useState([]); 
    const [index, setIndex] = useState(0);
    const [imageData, setImageData] = useState([]);
    const [userData, setUserData] = useState(null);

    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log("User not yet loaded");
        } else {
            let unsubscribe;

            const fetchCards = async () => {

                const userDocSnap = await getDoc(doc(db, 'users', user.uid));
                setUserData(userDocSnap.data());
            
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
                        where('uid', 'not-in', [...passedUserIds, ...likedUserIds]),
                    ),
                    (snapshot) => {
                        setFilteredProfiles(
                            snapshot.docs.filter((doc) => doc.id !== user.uid)
                            .map((doc) => ({
                                id: doc.id,
                                ...doc.data()
                            }
                        ))
                    );
                });
                
                const tempArray = filteredProfiles;
                for (var i = tempArray.length - 1; i >= 0; i--) {
                    if (tempArray[i].age < userData.ageRange[0] || tempArray[i].age > userData.ageRange[1]) {
                        console.log(tempArray[i].age, userData.ageRange[1]);
                        tempArray.splice(i, 1);
                    }
                    else if (!userData.genderPreference.includes(tempArray[i]?.gender)) {
                        tempArray.splice(i, 1);
                    }
                    else if (tempArray[i].handicap < userData.handicapRange[0] || tempArray[i].handicap > userData.handicapRange[1]) {
                        tempArray.splice(i, 1);
                    }
                    //ADD LOCATION FILTER NEXT
                }
                setProfiles(tempArray);
            };
    
            fetchCards();
            setIndex(0);
            
            console.log(profiles);

            return unsubscribe;
        }
    }, [user]);

    useEffect(() => {
        if (profiles) {
            setImageData(profiles[index]?.images);
        }
    }, [profiles]);

    const swipeLeft = () => {
        if (!profiles[index]) return;

        const userSwiped = profiles[index];
        console.log(`You swiped NEXT on ${userSwiped.firstName}`);

        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.uid),
        {
            uid: userSwiped.uid,
            firstName: userSwiped.firstName,
            age: userSwiped.age,
        });

        setIndex(index + 1);
    };

    const swipeRight = async () => {
        if (!profiles[index]) return;

        const userSwiped = profiles[index];
        const loggedInUser = await (
            await getDoc(doc(db, 'users', user.uid))
        ).data();

        //Make checking match a cloud function later

        getDoc(doc(db, 'users', userSwiped.id, 'likes', user.uid)).then(
            (documentSnapshot) => {
                if (documentSnapshot.exists()) {
                    //Other user has already swiped yes on you, create a match!
                    console.log(`You matched with ${userSwiped.firstName}`);

                    setDoc(doc(db, 'users', user.uid, 'likes', userSwiped.uid),
                    {
                        uid: userSwiped.uid,
                        firstName: userSwiped.firstName,
                        age: userSwiped.age,
                    });

                    //Match
                    setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.uid)), {
                        users: {
                            [user.uid]: loggedInUser,
                            [userSwiped.uid]: userSwiped,
                        },
                        usersMatched: [user.uid, userSwiped.uid],
                        timestamp: serverTimestamp(),
                    });

                    navigation.navigate("Match", {
                        loggedInUser,
                        userSwiped,
                    });
                    

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
        setIndex(index + 1);
    }; 

    return profiles?.length === 0 ? (
        <SafeAreaView className="flex-1 justify-center items-center">
            <Text className="text-2xl font-bold my-3">No more profiles!</Text>
            <Text className="text-lg mx-5">Try again later or expand your search in golf preferences to see more people</Text>
        </SafeAreaView>
    ) : (
        <SafeAreaView className="flex-1">
                <Text className="mx-5 mt-3 font-bold text-2xl">{profiles[index]?.firstName}</Text>
                <View className="flex justify-center items-center mt-3 self-center rounded-lg" style={{width: 350, height: 260}}>
                    <FlatList
                        data={imageData}
                        keyExtractor={item => item.id}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        renderItem={(item) => {
                            return (
                                <Image 
                                    className="rounded-lg" 
                                    source={{uri: item.item.url}}
                                    style={{width:350, height:260}}
                                />
                            )
                        }}
                    />
                </View>

                <View className="flex rounded-lg mt-3 bg-white self-center" style={{width: '90%'}}>
                    <View className="flex-row items-center justify-evenly mx-4 py-3 border-b border-slate-300">
                        <View className="flex-row items-center">
                            <MaterialCommunityIcons name='cake-variant-outline' size={24} color="black" />
                            <Text className="text-base mx-4">{profiles[index]?.age}</Text>
                        </View>

                        <View className="border-r border-slate-300 h-full">
                            <Text></Text>
                        </View>

                        <View className="flex-row items-center ml-4">
                            <AntDesign name='user' size={24} color="black" />
                            <Text className="text-base mx-4">{profiles[index]?.gender}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-evenly mx-4 py-3 border-b border-slate-300">
                        <View className="flex-row items-center">
                            <MaterialIcons name='sports-golf' size={24} color="black" />
                            <Text className="text-base mx-4">{profiles[index]?.playStyle}</Text>
                        </View>

                        <View className="border-r border-slate-300 h-full">
                            <Text></Text>
                        </View>

                        <View className="flex-row items-center ml-4">
                            <Text className="font-bold">HCP: </Text>
                            <Text className="text-base mx-4">{profiles[index]?.handicap}</Text>
                        </View>
                    </View>

                    <View className="flex-row items-center justify-center mx-4 py-3 border-b border-slate-300">
                        <Ionicons name='location-outline' size={24} color="black" />
                        <Text className="text-base mx-4">{profiles[index]?.city}</Text>
                    </View>

                    { 
                        profiles[index]?.course &&
                        <View className="flex-row items-center justify-center px-3 py-3 border-b border-slate-300 mx-4">
                            <Ionicons name='golf-outline' size={24} color="black" />
                            <Text className="text-base mx-4">{profiles[index]?.course}</Text>
                        </View>
                    }

                    <View className="py-3 mx-4">
                        <Text className="font-bold">What are you doing after a round?</Text>
                        <Text className="mt-2">{profiles[index]?.afterRound}</Text>
                    </View>

                </View>
            
                <View className="flex-1 justify-end mb-5">
                    <View className="flex-row justify-between mx-5">
                        <TouchableOpacity 
                            className="items-center justify-center rounded-full w-16 h-16 bg-red-500"
                            onPress={swipeLeft}
                        >
                            <Entypo name="cross" size={30} color="white"/>
                        </TouchableOpacity>

                        <TouchableOpacity 
                            className="items-center justify-center rounded-full w-16 h-16 bg-green-500"
                            onPress={swipeRight}
                        >
                            <Ionicons name="checkmark" size={30} color="white"/>
                        </TouchableOpacity>
                    </View>
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