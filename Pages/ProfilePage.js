import React, { useState } from "react";
import { View, Text, SafeAreaView, Button, Image } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc, getFirestore } from "firebase/firestore";
import { async } from "@firebase/util";

const firestore = getFirestore();

async function getDocument() {
    try {
        const docID = await AsyncStorage.getItem('@userCollectionID');
        if (docID !== null) {
            console.log('Fetched doc ID:', docID);
            try {
                const docRef = doc(firestore, 'users', docID);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    console.log('Successfully retrieved photos');
                    const photoArray = docSnap.get('photos');
                    return photoArray;
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

    const getPhotos = async () => {
        let photos = await getDocument();
        //console.log(photos);
        setFirstImage(photos[0]);
        console.log(firstImage);
    }

    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <View>
                <Image
                    className="w-52 h-52 border-solid border-2 border-black"
                    source={{uri: firstImage}}
                />
            </View>
            <Button title="Reset Onboarding" onPress={getPhotos}/>
        </SafeAreaView>
    );
};

export default ProfilePage;