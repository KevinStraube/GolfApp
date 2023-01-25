import { Image, SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React, { useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { doc, collection, getFirestore, updateDoc } from 'firebase/firestore';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firestore = getFirestore();

async function fetchDocID(imageData) {
    try {
        const docID = await AsyncStorage.getItem('@userCollectionID');
        if (docID !== null) {
            console.log('Fetched ID:', docID);
            try {
                const userDoc = doc(firestore, "users", docID);
                await updateDoc(userDoc, { photos: imageData });
                console.log("Updated images to database");
            } catch (e) {
                console.log('Error uploading images to database', e);
            }
        }
    } catch (error) {
        console.log('Error fetching @userCollectionID', error);
    }
}

const ImagesPage = ({ navigation }) => {
    const [firstImage, setFirstImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);
    const [fourthImage, setFourthImage] = useState(null);

    const [firstIconVisible, setFirstIconVisible] = useState(true);
    const [secondIconVisible, setSecondIconVisible] = useState(true);
    const [thirdIconVisible, setThirdIconVisible] = useState(true);
    const [fourthIconVisible, setFourthIconVisible] = useState(true);

    const handleNext = () => {
        const imageArray = [];
        if (firstImage) {
            imageArray.push(firstImage);
        }
        if (secondImage) {
            imageArray.push(secondImage);
        }
        if (thirdImage) {
            imageArray.push(thirdImage);
        }
        if (fourthImage) {
            imageArray.push(fourthImage);
        }

        fetchDocID(imageArray);
        
        navigation.navigate('Prompts')
    }

    /* Simple solution - refactor this later by compressing four functions into one */
    const pickFirstImage = async () => {
        setFirstIconVisible(false);

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setFirstImage(result.assets[0].uri);
        }
    }

    const pickSecondImage = async () => {
        setSecondIconVisible(false);

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setSecondImage(result.assets[0].uri);
        }
    }

    const pickThirdImage = async () => {
        setThirdIconVisible(false);

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setThirdImage(result.assets[0].uri);
        }
    }

    const pickFourthImage = async () => {
        setFourthIconVisible(false);

        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 1,
        });

        console.log(result);

        if (!result.canceled) {
            setFourthImage(result.assets[0].uri);
        }
    }

    return (
        <SafeAreaView>
            <Text className="text-xl font-semibold mt-8 self-center">Pick your photos</Text>
            <View className="mt-5">
                <View className="flex-row gap-5 justify-center items-center">
                    <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28" onPress={pickFirstImage}>
                        {firstImage && <Image source={{ uri: firstImage}} className="w-28 h-28 rounded-lg"/>}
                        {firstIconVisible && <AntDesign name='plus' size={34} color="gray" />}
                    </TouchableOpacity>
                    <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28" onPress={pickSecondImage}>
                        {secondImage && <Image source={{ uri: secondImage}} className="w-28 h-28 rounded-lg"/>}
                        {secondIconVisible && <AntDesign name='plus' size={34} color="gray" />}
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center items-center gap-5 mt-1">
                    <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28" onPress={pickThirdImage}>
                        {thirdImage && <Image source={{ uri: thirdImage}} className="w-28 h-28 rounded-lg"/>}
                        {thirdIconVisible && <AntDesign name='plus' size={34} color="gray" />}
                    </TouchableOpacity>
                    <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28" onPress={pickFourthImage}>
                        {fourthImage && <Image source={{ uri: fourthImage}} className="w-28 h-28 rounded-lg"/>}
                        {fourthIconVisible && <AntDesign name='plus' size={34} color="gray" />}
                    </TouchableOpacity>
                </View>
            </View>
            <View className="flex-row justify-around">
                <TouchableOpacity 
                    className="mt-10 rounded-lg bg-slate-400 p-3 w-20"
                    onPress={() => navigation.navigate('Location')}>
                    <Text className="self-center">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="mt-10 rounded-lg bg-slate-400 p-3 w-20"
                    onPress={handleNext}
                    >
                    <Text className="self-center">Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ImagesPage;