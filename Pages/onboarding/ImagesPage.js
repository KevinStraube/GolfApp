import { Alert, Image, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import React, { useEffect, useState } from 'react';
import { AntDesign } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { useAuth } from '../../hooks/useAuth';
import { arrayUnion, doc, getFirestore, updateDoc } from "firebase/firestore";
import { getDownloadURL, getStorage, ref, uploadBytes } from 'firebase/storage';

const firestore = getFirestore();
const storage = getStorage();

const ImagesPage = ({ navigation }) => {
    const [firstImage, setFirstImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);
    const [fourthImage, setFourthImage] = useState(null);

    const [images, setImages] = useState([]);

    const [disabled, setDisabled] = useState(true);

    const { user } = useAuth();

    const handleNext = async () => {

        images.map(async (image) => {
            const fileName = image.uri.substring(images[0].uri.lastIndexOf('/')+1, image.uri.lastIndexOf('.'));
            const storageRef = ref(storage, fileName);
            const response = await fetch(image.uri);
            const blob = await response.blob();

            try {
                uploadBytes(storageRef, blob).then((snapshot) => {
                    getDownloadURL(snapshot.ref).then(async (url) => {
                        await updateDoc(doc(firestore, "users", user.uid), {
                            images: arrayUnion({
                                id: Math.random(), 
                                url: url,
                            }),
                        })
                    });
                });
            } catch (error) {
                console.log("Error uploading images", error);
            }
        })
        
        navigation.navigate('Prompts');
    }

    /* Simple solution - refactor this later by compressing four functions into one */
    const pickFirstImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0,
        });

        if (!result.canceled) {
            setFirstImage(result.assets[0]);
            setImages((prevState) => [...prevState, result.assets[0]]);
            setDisabled(false);
        }
    }

    const pickSecondImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0,
        });

        if (!result.canceled) {
            setSecondImage(result.assets[0]);
            setImages((prevState) => [...prevState, result.assets[0]]);
            setDisabled(false);
        }
    }

    const pickThirdImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0,
        });

        if (!result.canceled) {
            setThirdImage(result.assets[0]);
            setImages((prevState) => [...prevState, result.assets[0]]);
            setDisabled(false);
        }
    }

    const pickFourthImage = async () => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0,
        });

        if (!result.canceled) {
            setFourthImage(result.assets[0]);
            setImages((prevState) => [...prevState, result.assets[0]]);
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
                        {firstImage && <Image source={{ uri: firstImage.uri}} className="w-28 h-28 rounded-lg"/>}
                        {!firstImage && <AntDesign name='plus' size={34} color="gray" />}
                    </TouchableOpacity>
                    <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28" onPress={pickSecondImage}>
                        {secondImage && <Image source={{ uri: secondImage.uri}} className="w-28 h-28 rounded-lg"/>}
                        {!secondImage && <AntDesign name='plus' size={34} color="gray" />}
                    </TouchableOpacity>
                </View>
                <View className="flex-row justify-center items-center gap-5 mt-1">
                    <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28" onPress={pickThirdImage}>
                        {thirdImage && <Image source={{ uri: thirdImage.uri}} className="w-28 h-28 rounded-lg"/>}
                        {!thirdImage && <AntDesign name='plus' size={34} color="gray" />}
                    </TouchableOpacity>
                    <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28" onPress={pickFourthImage}>
                        {fourthImage && <Image source={{ uri: fourthImage.uri}} className="w-28 h-28 rounded-lg"/>}
                        {!fourthImage && <AntDesign name='plus' size={34} color="gray" />}
                    </TouchableOpacity>
                </View>
            </View>
            <View className="flex-row justify-around">
                <TouchableOpacity 
                    className="mt-10 rounded-lg bg-lime-500 p-3 w-20"
                    onPress={() => navigation.navigate('Location')}>
                    <Text className="text-white font-semibold self-center">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="mt-10 rounded-lg bg-lime-500 p-3 w-20"
                    disabled={disabled}
                    style={disabled ? styles.disabled : styles.enabled}
                    onPress={handleNext}
                    >
                    <Text className="text-white font-semibold self-center">Next</Text>
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