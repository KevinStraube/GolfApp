import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Button, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { async } from "@firebase/util";

const firestore = getFirestore();

async function getData() {
    try {
        const docID = await AsyncStorage.getItem('@userCollectionID');
        if (docID !== null) {
            console.log('Fetched doc ID:', docID);
            try {
                const docRef = doc(firestore, 'users', docID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    console.log('Successfully retrieved data');
                    return data;
                }
            } catch (e) {
                console.log('Error getting doc from database', e);
            }
        }
    } catch (e) {
        console.log('Error fetching @userCollectionID from async storage:', e);
    }
}

const resetOnboarding = async () => {
    try {
        await AsyncStorage.removeItem('@viewedOnboarding');
        console.log("Removed @viewedonboarding");
    } catch (error) {
        console.log("Error removing @viewedOnboarding to AsyncStorage: ", error);
    }
}

const ProfilePage = () => {
    const [firstImage, setFirstImage] = useState('');
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState('');
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState(0);
    const [afterRound, setAfterRound] = useState('');
    const [location, setLocation] = useState('');

    const loadData = async () => {
        let data = await getData();
        setFirstImage(data.photos[0]);
        setName(data.firstName);
        setAge(data.age);
        setGender(data.gender);
        setPlayStyle(data.playStyle);
        setHandicap(data.handicap);
        setAfterRound(data.afterRound);
        setLocation(data.city);
    }

    useEffect(() => {
        loadData();
    })

    return (
        <SafeAreaView className="flex-1">
            <Text className="text-2xl font-semibold mx-9 mt-4">{name}</Text>
            <View>
                <Image
                    className="w-80 h-72 border-solid border-2 border-black mt-5 self-center"
                    source={{uri: firstImage}}
                />
            </View>
            <View className="flex-row items-center justify-around mt-4">
                <Text>{age} years old</Text>
                <Text>{gender}</Text>
                <Text>{location}</Text>
            </View>
            <View className="mx-9 mt-16">
                <Text className="font-bold">Play Style</Text>
                <Text>{playStyle}</Text>
                <Text className="font-bold mt-4">Handicap</Text>
                <Text>{handicap}</Text>
                <Text className="font-bold mt-4">What are you doing after a round?</Text>
                <Text className="mb-24">{afterRound}</Text>
            </View>
            <Button title="Reset Onboarding" onPress={resetOnboarding}/>
        </SafeAreaView>
    );
};

export default ProfilePage;