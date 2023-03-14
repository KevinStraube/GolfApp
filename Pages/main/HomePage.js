import React, { useEffect, useLayoutEffect, useRef, useState } from "react";
import { View, Text, FlatList, SafeAreaView, Image, TouchableOpacity, StyleSheet, Alert, Button, Animated } from "react-native";
import { auth } from '../../firebase';
import { AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { onSnapshot, getFirestore, doc, collection, setDoc, getDocs, query, where, getDoc, serverTimestamp, limit } from "firebase/firestore";
import generateId from '../../lib/generateId';
import { distanceBetween } from "geofire-common";
import { sendPushNotification } from "../../backend/NotificationFunctions";
import Paginator from "../../registration/Paginator";

const db = getFirestore();

const HomePage = ({ navigation }) => {
    const [profiles, setProfiles] = useState([]);
    const [index, setIndex] = useState(0);
    const [imageData, setImageData] = useState([]);
    const [userData, setUserData] = useState(null);
    const [unfilteredData, setUnfilteredData] = useState([]);

    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const { user } = useAuth();

    //First effect to load all profiles
    useEffect(() => {
        if (!user) {
            console.log("User not yet loaded");
        } else {
            let unsubscribe;

            const fetchCards = async () => {
                //Fetch data of the logged in user
                const userDocSnap = await getDoc(doc(db, 'users', user.uid));
                setUserData(userDocSnap.data());
            
                //Fetch all accounts the user has passed on
                const passes = await getDocs(collection(db, 'users', user.uid, 'passes')).then
                    ((snapshot) => snapshot.docs.map((doc) => doc.id)
                );

                //Fetch all accounts the user has liked
                const likes = await getDocs(collection(db, 'users', user.uid, 'likes')).then
                    ((snapshot) => snapshot.docs.map((doc) => doc.id)
                );

                //Ensure passes and likes are not empty (an empty array will throw and error)
                const passedUserIds = passes.length > 0 ? passes : ["test"];
                const likedUserIds = likes.length > 0 ? likes : ["test"];

                //Query all accounts that exist and filter out accounts that user has already interacted with
                //Set the results to unfiltered data
                unsubscribe = onSnapshot(
                    query(
                        collection(db, 'users'),
                        where('uid', 'not-in', [...passedUserIds, ...likedUserIds]),
                        limit(100),
                    ),
                    (snapshot) => {
                        setUnfilteredData(
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

            return unsubscribe;
        }
    }, [user]);

    /* Second effect to filter profiles */
    useEffect(() => {
        if (unfilteredData) {
            const tempArray = unfilteredData;
            for (var i = tempArray.length - 1; i >= 0; i--) {
                //Check if age is within specified range
                if (tempArray[i].age < userData.ageRange[0] || tempArray[i].age > userData.ageRange[1]) {
                    console.log(tempArray[i].age, userData.ageRange[1]);
                    tempArray.splice(i, 1);
                }
                //Check if gender is in preferences
                else if (!userData.genderPreference.includes(tempArray[i]?.gender)) {
                    tempArray.splice(i, 1);
                }
                //Check if handicap is in specified range
                else if (tempArray[i].handicap < userData.handicapRange[0] || tempArray[i].handicap > userData.handicapRange[1]) {
                    tempArray.splice(i, 1);
                } 
                else if (tempArray[i]?.paused === true) {
                    tempArray.splice(i, 1);
                }
                //Check if location is in specified range
                else {
                    if (tempArray[i]?.location.coords.latitude && tempArray[i]?.location.coords.longitude) {
                        const distanceBetweenUsers = distanceBetween(
                            [tempArray[i]?.location.coords.latitude, tempArray[i]?.location.coords.longitude],
                            [userData.location.coords.latitude, userData.location.coords.longitude]
                        );
                        
                        //console.log("Distance:", distanceBetweenUsers);

                        if (distanceBetweenUsers > userData.distancePreference) {
                            tempArray.splice(i, 1);
                        }
                    }
                }
            }
            //Set profiles to the newly filtered data
            setProfiles(tempArray);
        } else {
            console.log("profiles not loaded yet");
        }
    }, [unfilteredData]);

    /* third effect to load images onto profiles */
    useEffect(() => {
        if (profiles) {
            setImageData(profiles[index]?.images);
        }
    }, [profiles, index])

    //User presses next on the profile they see
    const swipeLeft = () => {
        //Do nothing if there is no profile on the screen
        if (!profiles[index]) return;

        //Get profile of the user they see
        const userSwiped = profiles[index];
        console.log(`You swiped NEXT on ${userSwiped.firstName}`);

        //Add user to 'passes' collection, if one exists, otherwise create one
        setDoc(doc(db, 'users', user.uid, 'passes', userSwiped.uid),
        {
            //Store user's uid, name and age
            //No need to store anything else
            uid: userSwiped.uid,
            firstName: userSwiped.firstName,
            age: userSwiped.age,
        });

        //Increase index in the array to show next profile
        setIndex(index + 1);
    };

    //Users presses yes on the profile they see
    const swipeRight = async () => {
        //Do nothing if there is no profile on the screen
        if (!profiles[index]) return;

        //Get profile of the user they see
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

                    //Add other user to likes collection, if it does not exist, create it
                    setDoc(doc(db, 'users', user.uid, 'likes', userSwiped.uid),
                    {
                        uid: userSwiped.uid,
                        firstName: userSwiped.firstName,
                        age: userSwiped.age,
                    });

                    //Add match to new matches collection. Doc ID are both user IDs concatenated
                    setDoc(doc(db, 'matches', generateId(user.uid, userSwiped.uid)), {
                        users: {
                            [user.uid]: loggedInUser,
                            [userSwiped.uid]: userSwiped,
                        },
                        usersMatched: [user.uid, userSwiped.uid],
                        timestamp: serverTimestamp(),
                    });

                    //Display match screen
                    navigation.navigate("Match", {
                        loggedInUser,
                        userSwiped,
                    });

                    //Send other user a notification
                    sendPushNotification(userSwiped.notificationToken, "You got a match!", "Message them and set up a round");

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
        //Increment index in the array to show next profile
        setIndex(index + 1);
    }; 

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = async () => {
        if (currentIndex < imageData.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1});
        } else {
            try {
                await AsyncStorage.setItem('@viewedOnboarding', 'true');
            } catch (error) {
                console.log("Error @setItem: ", error);
            }
        }
    };

    return profiles?.length <= index ? (
        <SafeAreaView className="flex-1 justify-center items-center">
            <Text className="text-2xl font-bold my-3">No more profiles!</Text>
            <Text className="text-lg mx-5">Try again later or expand your search in golf preferences to see more people</Text>
        </SafeAreaView>
    ) : (
        <SafeAreaView className="flex-1">
            <View className="self-center">
                <Image source={require('../../assets/TransparentLogo.png')} className="w-9 h-9"/>
            </View>
            <Text className="mx-5 font-bold text-2xl">{profiles[index]?.firstName}</Text>
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
                    onScroll={Animated.event([{nativeEvent: {contentOffset: { x: scrollX } } }], {
                        useNativeDriver: false,
                    })}
                    onViewableItemsChanged={viewableItemsChanged}
                    viewabilityConfig={viewConfig}
                    ref={slidesRef}
                />
            </View>
            
            <View style={{marginTop: -20, marginBottom: -10}} className="self-center">
                <Paginator data={imageData} scrollX={scrollX}/>
            </View>

            <View className="flex rounded-lg bg-white self-center" style={{width: '90%'}}>
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
                        className="items-center justify-center rounded-full w-16 h-16 bg-red-300"
                        onPress={swipeLeft}
                    >
                        <Entypo name="cross" size={30} color="red"/>
                    </TouchableOpacity>

                    <TouchableOpacity 
                        className="items-center justify-center rounded-full w-16 h-16 bg-green-300"
                        onPress={swipeRight}
                    >
                        <Ionicons name="checkmark" size={30} color="green"/>
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