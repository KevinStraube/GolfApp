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
    //Array of image names selected by the user on the screen (includes previous images)
    const [imageArray, setImageArray] = useState([]);
    //Array of previous image names (to be compared with new list at the end for image deletion)
    const [originalImageNames, setOriginalImageNames] = useState([]);
    //Array of full image URLs (this will contain the same images as imageArray)
    const [urlArray, setUrlArray] = useState([]);
    
    //Variable for each potential image 
    const [firstImage, setFirstImage] = useState(null);
    const [secondImage, setSecondImage] = useState(null);
    const [thirdImage, setThirdImage] = useState(null);
    const [fourthImage, setFourthImage] = useState(null);

    //Loading state while data is being fetched
    const [loading, setLoading] = useState(true);

    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            const getData = async () => {
                try {
                    //Get user's data from database
                    const docSnap = await getDoc(doc(firestore, 'users', user.uid));
                    
                    if (docSnap.exists()) {
                        const data = docSnap.data();
                        //Populate three arrays with the user's image data
                        populateImageArray(data.images);
                        getOldImageNames(data.images);
                        populateUrlArray(data.images);

                        //Assign image variables based on if they exist (minimum one must exist)
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
        //Launch image picker when user presses one of the four image buttons
        let result = await ImagePicker.launchImageLibraryAsync({
            mediaTypes: ImagePicker.MediaTypeOptions.Images,
            allowsEditing: true,
            aspect: [4,3],
            quality: 0,
        });

        /**
         * When a picture is chosen, based on the index:
         * - Assign the image with random ID and uri
         * - Update the image array
         * - Update the URL array
         */
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

    //Populate original image names. Runs on component mount
    const getOldImageNames = (images) => {
        //Temporary array that can be easily manipulated before updating the state array
        var imageNames = [];

        //Loop through existing image array
        for (let i = 0; i < images.length; i++) {
            //Get substring of name from full URL
            const name = images[i].url.substring(images[i].url.lastIndexOf('/')+1, images[i].url.lastIndexOf('?'));
            imageNames.push(name);
        }

        setOriginalImageNames(imageNames);
    }

    //Populate image array. Runs on component mount
    const populateImageArray = (images) => {
        //Temporary array that can be easily manipulated before updating the state array
        var imageNames = [];

        //Loop through existing image array
        for (let i = 0; i < images.length; i++) {
            //Get substring of name from full URL
            const name = images[i].url.substring(images[i].url.lastIndexOf('/')+1, images[i].url.lastIndexOf('?'));
            imageNames.push(name);
        }

        //Populate array with empty strings if length is less than 4. This makes it easy to maintain index positions later
        while (imageNames.length < 4) {
            imageNames.push("");
        }

        setImageArray(imageNames);
    }

    //Populate URL array. Runs on component mount
    const populateUrlArray = (images) => {
        //Temporary array that can be easily manipulated before updating the state array
        var imageUrls = [];

        //Loop through existing image array
        for (let i = 0; i < images.length; i++) {
            //Add full URL to the temp array
            imageUrls.push(images[i].url);
        }

        //Populate array with empty strings if length is less than 4. This makes it easy to maintain index positions later
        while (imageUrls.length < 4) {
            imageUrls.push("");
        }

        setUrlArray(imageUrls);
    }

    //Update imageArray when a new image is selected
    const newImageArray = (index, newImage) => {
        //Update array directly in state
        const replacementImageArray = imageArray.map((image, i) => {
            //Replace current value with new image name
            if (i === index) {
                return newImage.substring(newImage.lastIndexOf('/')+1, newImage.lastIndexOf('.'));
            } else {
                return image;
            }
        });

        setImageArray(replacementImageArray);
    }

    //Update URL array when a new image is selected
    const updateUrlArray = (index, newImage) => {
        //Update array directly in state
        const replacementUrlArray = urlArray.map((image, i) => {
            //Replace current value with new image URL
            if (i === index) {
                return newImage;
            } else {
                return image;
            }
        });

        setUrlArray(replacementUrlArray);
    }

    //Remove image from array when it is cleared by the user
    const removeImageFromArray = (index) => {
        //Update image array directly in state
        const newImageArray = imageArray.map((image, i) => {
            if (i === index) {
                return "";
            } else {
                return image;
            }
        });
        setImageArray(newImageArray);

        //Update URL array directly in state
        const newUrlArray = urlArray.map((image, i) => {
            if (i === index) {
                return "";
            } else {
                return image;
            }
        });
        setUrlArray(newUrlArray);
    }

    //Show alert box when user long-presses any image button
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

    //Delete old images from storage that user has replaced
    const deleteOldImages = (filteredArray) => {
        //Loop through original images 
        for (let i = 0; i < originalImageNames.length; i++) {
            //If original image is not in the new image array, delete it
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

    //Upload new images to both storage and database
    const uploadNewImages = async (filteredArray) => {
        const docRef = doc(firestore, 'users', user.uid);
        //Get user's data
        await getDoc(docRef)
        .then((docSnap) => {
            //Convert all new image URLs to names. Compare database names to new list, delete from database if name does not exist in new list
            var filteredArrayNames = [];

            //Get the name substring from the URL array. URL may be a firebase URL or a local image URL. Get substring accordingly
            for (let i = 0; i < filteredArray.length; i++) {
                if (filteredArray[i].includes('firebase')) {
                    filteredArrayNames.push(filteredArray[i].substring(filteredArray[i].lastIndexOf('/')+1), filteredArray[i].lastIndexOf('?'));
                } else {
                    filteredArrayNames.push(filteredArray[i].substring(filteredArray[i].lastIndexOf('/')+1), filteredArray[i].lastIndexOf('.'));
                }
            }

            var currentImageNames = [];

            //Get the name substring from the database
            for (let i = 0; i < docSnap.data().images.length; i++) {
                const currentImage = docSnap.data().images[i].url;
                //Only firebase URLs exist in the database
                const onlyName = currentImage.substring(currentImage.lastIndexOf('/')+1, currentImage.lastIndexOf('?'));

                //If old image does not exist in the new array, remove it from the database otherwise add it to current array
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

            //Loop through final filtered array
            filteredArray.map(async (image) => {
                //Get the name substring from the URL array. URL may be a firebase URL or a local image URL. Get substring accordingly
                let imageName;
                if (image.includes('firebase')) {
                    imageName = image.substring(image.lastIndexOf('/')+1, image.lastIndexOf('?'));
                } else {
                    imageName = image.substring(image.lastIndexOf('/')+1, image.lastIndexOf('.'));
                }

                //If image does not already exist
                if (!currentImageNames.includes(imageName)) {
                    const imageRef = ref(storage, imageName);
                    const response = await fetch(image);
                    const blob = await response.blob();
                    
                    //Upload image to storage, then get the download URL, and finally update database to include the new image object
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

    //User presses apply button
    const handleApply = () => {
        var tempUrlArray = urlArray;
        
        //Remove empty strings from arrays if any exist
        const filteredImageArray = imageArray.filter(elem => elem !== "");
        const filteredUrlArray = tempUrlArray.filter(elem => elem !== "");
        
        //Call function to delete old images
        deleteOldImages(filteredImageArray);
        
        //Call function to upload new images
        uploadNewImages(filteredUrlArray);
        
        //Go back to main settings menu
        navigation.goBack();
        navigation.goBack();

        //Alert the user that the process has completed
        Alert.alert("Photos Updated");
        
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
                        className="self-center items-center py-3 bg-green-700 rounded-lg mt-10 w-4/6"
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