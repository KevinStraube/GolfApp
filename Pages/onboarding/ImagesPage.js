import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/useAuth';
import { async } from '@firebase/util';
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage';

const storage = getStorage();

const ImagesPage = ({ navigation }) => {
    const [firstImage, setFirstImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);
    const [fourthImage, setFourthImage] = useState(null);

    const [firstIconVisible, setFirstIconVisible] = useState(true);
    const [secondIconVisible, setSecondIconVisible] = useState(true);
    const [thirdIconVisible, setThirdIconVisible] = useState(true);
    const [fourthIconVisible, setFourthIconVisible] = useState(true);

    const [disabled, setDisabled] = useState(true);

    const { user } = useAuth();

    const handleNext = async () => {
        //Build an array of image URIs to be passed, only if URI exists
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
        
        const fileName = imageArray[0].substring(imageArray[0].lastIndexOf('/')+1, imageArray[0].lastIndexOf('.'));
    
        const blobImage = await new Promise((resolve, reject) => {
            const xhr = new XMLHttpRequest();
            xhr.onload = function() {
                resolve(xhr.response);
            };
            xhr.onerror = function() {
                reject(new TypeError("Network request failed"));
            };
            xhr.responseType = "blob";
            xhr.open("GET", imageArray[0], true);
            xhr.send(null);
        });

        //Create the file metadata
        /** @type {any} */
        const metadata = {
            contentType: 'image/jpeg'
        }

        //Upload image to storage
        const storageRef = ref(storage, fileName+'-'+Date.now());
        const uploadTask = uploadBytesResumable(storageRef, blobImage, metadata);

        //Listen for state changes, errors, and completion of the upload
        uploadTask.on('state_changed',
            (snapshot) => {
                //Get task progress
                const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                console.log('Upload is ' + progress + '% done');
                switch (snapshot.state) {
                    case 'paused':
                        console.log('Upload is paused');
                        break;
                    case 'running':
                        console.log('Upload is running');
                        break;
                    
                }
            },
            (error) => {
                switch (error.code) {
                    case 'storage/unauthorized':
                        break;
                    case 'storage/canceled':
                        console.log('User cancelled the upload.');
                        break;
                    case 'storage/unknown':
                        console.log('Unknown error occurred. Check error.serverResponse');
                        break;
                }
            },
            () => {
                getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                    console.log('File available at:', downloadURL);
                });
            });

        for (let i = 0; i < imageArray.length; i++) {
            console.log(imageArray[i]);
        }
        
        //navigation.navigate('Prompts')
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
            setDisabled(false);
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
            setDisabled(false);
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
            setDisabled(false);
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
            setDisabled(false);
        }
    }

    return (
        <SafeAreaView>
            <Text className="text-xl font-semibold mt-8 self-center">Pick your photos</Text>
            <Text className="self-center text-slate-500 mt-3">Please choose at least one</Text>
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
                    disabled={disabled}
                    style={disabled ? styles.disabled : styles.enabled}
                    onPress={handleNext}
                    >
                    <Text className="self-center">Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    enabled: {
        opacity: 1,
    },
    disabled: {
        opacity: 0.3,
    },
});

export default ImagesPage;