import { View, Text, SafeAreaView, TouchableOpacity, Image, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { AntDesign } from '@expo/vector-icons';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { arrayRemove, arrayUnion, doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore, storage } from '../../firebase';
import LoadingPage from '../main/LoadingPage';
import * as ImagePicker from 'expo-image-picker';
import { deleteObject, getDownloadURL, ref, uploadBytes } from 'firebase/storage';

const EditImagesPage = ({ navigation }) => {
    const [imageArray, setImageArray] = useState([]);
    const [originalImageNames, setOriginalImageNames] = useState([]);
    const [urlArray, setUrlArray] = useState([]);
    const [firstImage, setFirstImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);
    const [fourthImage, setFourthImage] = useState(null);
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const getData = async () => {
                try {
                    const docSnap = await getDoc(doc(firestore, 'users', user.uid));
                    
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        populateImageArray(data.images);
                        getOldImageNames(data.images);
                        populateUrlArray(data.images);

                        setFirstImage(data.images[0]);
                        if (data.images[1]) {
                            setSecondImage(data.images[1]);
                        }
                        if (data.images[2]) {
                            setThirdImage(data.images[2]);
                        }
                        if (data.images[3]) {
                            setFourthImage(data.images[3]);
                        }

                        setLoading(false);
                    }
                }
                catch (error) {
                    console.log(error);
                }
            }
            getData();
        }
    }, [user]);

    const selectImage = async (index) => {
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0,
        });

        if (!result.canceled) {
            if (index === 0) {
                setFirstImage({id: Math.random(), url: result.assets[0].uri});
                newImageArray(0, result.assets[0].uri);
                updateUrlArray(0, result.assets[0].uri);
            }
            else if (index === 1) {
                setSecondImage({id: Math.random(), url: result.assets[0].uri});
                newImageArray(1, result.assets[0].uri);
                updateUrlArray(1, result.assets[0].uri);
            }
            else if (index === 2) {
                setThirdImage({id: Math.random(), url: result.assets[0].uri});
                newImageArray(2, result.assets[0].uri);
                updateUrlArray(2, result.assets[0].uri);
            }
            else {
                setFourthImage({id: Math.random(), url: result.assets[0].uri});
                newImageArray(3, result.assets[0].uri);
                updateUrlArray(3, result.assets[0].uri);
            }
        }
    }

    const getOldImageNames = (images) => {
        var imageNames = [];

        for (let i = 0; i < images.length; i++) {
            const name = images[i].url.substring(images[i].url.lastIndexOf('/')+1, images[i].url.lastIndexOf('?'));
            imageNames.push(name);
        }

        setOriginalImageNames(imageNames);
    }

    const populateImageArray = (images) => {
        var imageNames = [];

        for (let i = 0; i < images.length; i++) {
            const name = images[i].url.substring(images[i].url.lastIndexOf('/')+1, images[i].url.lastIndexOf('?'));
            imageNames.push(name);
        }

        while (imageNames.length < 4) {
            imageNames.push("");
        }

        setImageArray(imageNames);
    }

    const populateUrlArray = (images) => {
        var imageUrls = [];

        for (let i = 0; i < images.length; i++) {
            imageUrls.push(images[i].url);
        }

        while (imageUrls.length < 4) {
            imageUrls.push("");
        }

        setUrlArray(imageUrls);
    }

    const newImageArray = (index, newImage) => {
        const replacementImageArray = imageArray.map((image, i) => {
            if (i === index) {
                return newImage.substring(newImage.lastIndexOf('/')+1, newImage.lastIndexOf('.'));
            } else {
                return image;
            }
        });

        setImageArray(replacementImageArray);
    }

    const updateUrlArray = (index, newImage) => {
        const replacementUrlArray = urlArray.map((image, i) => {
            if (i === index) {
                return newImage;
            } else {
                return image;
            }
        });

        setUrlArray(replacementUrlArray);
    }

    const removeImageFromArray = (index) => {
        const newImageArray = imageArray.map((image, i) => {
            if (i === index) {
                return "";
            } else {
                return image;
            }
        });
        setImageArray(newImageArray);

        const newUrlArray = urlArray.map((image, i) => {
            if (i === index) {
                return "";
            } else {
                return image;
            }
        });
        setUrlArray(newUrlArray);
    }

    const clearImage = (index) => {
        Alert.alert("Clear Image?","",[
            {
                text: 'Cancel',
                style: 'cancel',
            },
            {
                text: 'OK',
                onPress: () => {
                    if (index === 0) {
                        setFirstImage(null);
                        removeImageFromArray(0);
                    }
                    else if (index === 1) {
                        setSecondImage(null);
                        removeImageFromArray(1);
                    }
                    else if (index === 2) {
                        setThirdImage(null);
                        removeImageFromArray(2);
                    }
                    else {
                        setFourthImage(null);
                        removeImageFromArray(3);
                    }
                }
            }
        ]);
    }

    const deleteOldImages = (filteredArray) => {
        for (let i = 0; i < originalImageNames.length; i++) {
            console.log(originalImageNames[i]);
            if (!filteredArray.includes(originalImageNames[i])) {
                const imageRef = ref(storage, originalImageNames[i]);
                deleteObject(imageRef)
                .then(() => {
                    console.log("Image deleted", originalImageNames[i]);
                })
                .catch((error) => {
                    console.log("Error deleting image:", error);
                });
            }
        }
    }

    const uploadNewImages = async (filteredArray) => {
        const docRef = doc(firestore, 'users', user.uid);
        await getDoc(docRef)
        .then((docSnap) => {
            //Convert all new image URLs to names. Compare database names to new list, delete from database if name does not exist in new list
            var filteredArrayNames = [];

            for (let i = 0; i < filteredArray.length; i++) {
                if (filteredArray[i].includes('firebase')) {
                    filteredArrayNames.push(filteredArray[i].substring(filteredArray[i].lastIndexOf('/')+1), filteredArray[i].lastIndexOf('?'));
                } else {
                    filteredArrayNames.push(filteredArray[i].substring(filteredArray[i].lastIndexOf('/')+1), filteredArray[i].lastIndexOf('.'));
                }
            }

            var currentImageNames = [];

            for (let i = 0; i < docSnap.data().images.length; i++) {
                const currentImage = docSnap.data().images[i].url;
                const onlyName = currentImage.substring(currentImage.lastIndexOf('/')+1, currentImage.lastIndexOf('?'));

                if (!filteredArrayNames.includes(onlyName)) {
                    updateDoc(docRef, {
                        images: arrayRemove({
                            id: docSnap.data().images[i].id,
                            url: docSnap.data().images[i].url,
                        })
                    });
                } else {
                    currentImageNames.push(onlyName);
                }
            }

            filteredArray.map(async (image) => {
                let imageName;
                if (image.includes('firebase')) {
                    imageName = image.substring(image.lastIndexOf('/')+1, image.lastIndexOf('?'));
                } else {
                    imageName = image.substring(image.lastIndexOf('/')+1, image.lastIndexOf('.'));
                }

                if (!currentImageNames.includes(imageName)) {
                    const imageRef = ref(storage, imageName);
                    const response = await fetch(image);
                    const blob = await response.blob();
        
                    try {
                        uploadBytes(imageRef, blob)
                            .then((snapshot) => {
                                getDownloadURL(snapshot.ref)
                                    .then((url) => {
                                        updateDoc(docRef, {
                                            images: arrayUnion({
                                                id: Math.random(),
                                                url: url,
                                            }),
                                        })
                                        
                                    })
                                    .catch((error) => {
                                        console.log("Error retrieving image download URL:", error);
                                    }
                                );
                            }
                        );
                    }
                    catch (error) {
                        console.log("Error uploading image to storage:", error);
                    }
                }
            })
        })
        .catch((error) => {
            console.log("Error clearing images:", error);
        })
    }

    const handleApply = () => {
        var tempUrlArray = urlArray;
        
        //Remove empty strings from arrays if any exist
        
        const filteredImageArray = imageArray.filter(elem => elem !== "");
        const filteredUrlArray = tempUrlArray.filter(elem => elem !== "");
        
        deleteOldImages(filteredImageArray);
        
        uploadNewImages(filteredUrlArray);
        /*
        navigation.goBack();
        navigation.goBack();

        Alert.alert("Images Uploaded", "You may need to restart the app to see changes.");
        */
    }

    return (
        <SafeAreaView>
            <Header title={"Edit Photos"}/>
            {
                loading ? <LoadingPage />
                :
                <View>
                    <Text className="font-semibold text-xl self-center mt-5">Select your photos</Text>
                    <Text className="text-slate-500 self-center mt-2">Press and hold an image to clear it</Text>
                    <View className="mt-5">
                        <View className="flex-row gap-5 justify-center items-center">
                            <TouchableOpacity 
                                className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-32 w-32"
                                onPress={() => selectImage(0)}
                                onLongPress={() => clearImage(0)}
                            >
                                {
                                    firstImage ? 
                                    <Image source={{uri: firstImage?.url}} className="h-32 w-32 rounded-lg"/>
                                    : 
                                    <AntDesign name='plus' size={34} color='gray'/>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-32 w-32"
                                onPress={() => selectImage(1)}
                                onLongPress={() => clearImage(1)}
                            >
                                {
                                    secondImage ? 
                                    <Image source={{uri: secondImage?.url}} className="h-32 w-32 rounded-lg"/>
                                    : 
                                    <AntDesign name='plus' size={34} color='gray'/>
                                }
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row gap-5 justify-center items-center mt-1">
                            <TouchableOpacity 
                                className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-32 w-32"
                                onPress={() => selectImage(2)}
                                onLongPress={() => clearImage(2)}
                            >
                                {
                                    thirdImage ? 
                                    <Image source={{uri: thirdImage?.url}} className="h-32 w-32 rounded-lg"/>
                                    : 
                                    <AntDesign name='plus' size={34} color='gray'/>
                                }
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-32 w-32"
                                onPress={() => selectImage(3)}
                                onLongPress={() => clearImage(3)}
                            >
                                {
                                    fourthImage ? 
                                    <Image source={{uri: fourthImage?.url}} className="h-32 w-32 rounded-lg"/>
                                    : 
                                    <AntDesign name='plus' size={34} color='gray'/>
                                }
                            </TouchableOpacity>
                        </View>
                    </View>
                    <TouchableOpacity 
                        className="self-center items-center py-3 bg-green-600 rounded-lg mt-10 w-4/6"
                        style={!firstImage && !secondImage && !thirdImage && !fourthImage ? styles.disabled : styles.enabled}
                        disabled={!firstImage && !secondImage && !thirdImage && !fourthImage}
                        onPress={handleApply}
                    >
                        <Text className="text-white font-semibold text-base">Apply</Text>
                    </TouchableOpacity>
                </View>
            }
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

export default EditImagesPage;