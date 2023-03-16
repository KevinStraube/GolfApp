import { View, Text, SafeAreaView, TouchableOpacity, TextInput, Button, ActivityIndicator } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useAuth } from '../../../hooks/useAuth';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential, FacebookAuthProvider, GoogleAuthProvider } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { collection, deleteDoc, doc, getDoc, onSnapshot, query } from 'firebase/firestore';
import { firestore, storage } from '../../../firebase';
import { deleteObject, ref } from 'firebase/storage';

const DeleteAccount = () => {
    const [understand, setUnderstand] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log("User is loading...");
        } else {
            console.log(user);
        }
    }, [user]);

    const deleteAccount = async () => {
        setLoading(true);
        const userId = user.uid;

        return Promise.all(
            //Delete all the user's likes from database
            onSnapshot(
                query(
                    collection(firestore, 'users', userId, 'likes'),
                ),(snapshot) => 
                    snapshot.docs.forEach(async (snap) => (
                        await deleteDoc(snap.ref)
                    )
                )
            ),

            //Delete all the user's passes from database
            onSnapshot(
                query(
                    collection(firestore, 'users', userId, 'passes'),
                ),(snapshot) => 
                    snapshot.docs.forEach(async (snap) => (
                        await deleteDoc(snap.ref)
                    )
                )
            ),

            //Search for any matches containing the user and delete those
            onSnapshot(
                query(
                    collection(firestore, 'matches'),
                ), (snapshot) =>
                    snapshot.docs.forEach(async (snap) => {
                        if (snap.id.includes(userId)) {
                            //User found in a match
                            //Delete all messages
                            query(
                                collection(firestore, 'matches', snap.id, 'messages'),
                            ), (messageSnapshot) => 
                            messageSnapshot.docs.forEach(async (messageSnap) => (
                                await deleteDoc(messageSnap.ref)
                            ))

                            //Delete match
                            await deleteDoc(snap.ref);
                        }
                    }
                )
            ),

            //Delete user
            await deleteDoc(doc(firestore, 'users', userId))
                .catch((error) => {
                    console.log(error);
                }
            )
        )
    }

    const deleteImages = async () => {
        //Get user data from database
        const docSnap = await getDoc(doc(firestore, 'users', user.uid));

        if (docSnap.exists()) {
            //Load all images
            const images = docSnap.data().images;
            for (let i = 0; i < images.length; i++) {
                //Get image name from substring of complete URL
                const imageName = images[i].url.substring(images[i].url.lastIndexOf('/')+1, images[i].url.lastIndexOf('?'));
                //Create a reference to that image from storage
                const imageRef = ref(storage, imageName);

                //Delete the image
                deleteObject(imageRef)
                .catch((error) => {
                    console.log("Error deleting image:", error);
                });
            }
        }
    }

    //Called when user presses delete account button
    const deleteAllData = async () => {
        deleteImages();
        await deleteAccount();
        deleteUser(user)
        .catch((error) => {
            console.log("Error deleting user:", error);
        });
    }

    const reauthenticateUser = () => {
        //Have user re-enter password 
        const credential = EmailAuthProvider.credential(user.email, password);
        reauthenticateWithCredential(user, credential).then(() => {
            setAuthenticated(true);
        }).catch((error) => {
            console.log("Error signing in:", error);
            setIncorrectPassword(true);
        });
    }

    const reauthenticateGoogle = async () => {
        //Set client IDs with app information from Google Cloud Console
        GoogleSignin.configure({
            webClientId: '1013459442897-1kln95dv1g5ahsr9om89gomkbu06jl84.apps.googleusercontent.com',
            iosClientId: '1013459442897-rfh4frat8l9f5u9hafc7hp735luvbdjr.apps.googleusercontent.com',
        });

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        //Get credential from GoogleSignIn library
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = GoogleAuthProvider.credential(idToken);
        //Sign into Firebase using generated credential
        reauthenticateWithCredential(user, googleCredential)
            .then(() => {
                setAuthenticated(true);
            })
            .catch((error) => {
                console.log("Error re-authenticating with Google:", error);
            });
    }

    const reauthenticateFacebook = async () => {
        //Display Facebook login screen
        await LoginManager.logInWithPermissions(['public_profile', 'email']);

        //Get user's access token
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            console.log("Error fetching access token");
        }

        //Get Facebook credential based on access token
        const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

        reauthenticateWithCredential(user, facebookCredential)
            .then(() => {
                setAuthenticated(true);
            })
            .catch((error) => {
                console.log("Error re-authenticating with Facebook:", error);
            });
    }

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Delete Account"}/>
            {
            !authenticated && user?.providerData[0].providerId === "facebook.com" &&
            <View className="flex-1">
                <Text className="font-medium text-lg ml-5 mt-3">Please login again with Facebook</Text>
                <TouchableOpacity 
                    className="w-4/5 py-3 rounded-lg bg-green-600 items-center self-center mt-5"
                    onPress={reauthenticateFacebook}
                >
                    <Text className="font-semibold text-base text-white">Login</Text>
                </TouchableOpacity>
            </View>
            }
            {
            !authenticated && user?.providerData[0].providerId === "google.com" &&
            <View className="flex-1">
                <Text className="font-medium text-lg ml-5 mt-3">Please login again with Google</Text>
                <TouchableOpacity 
                    className="w-4/5 py-3 rounded-lg bg-green-600 items-center self-center mt-5"
                    onPress={reauthenticateGoogle}
                >
                    <Text className="font-semibold text-base text-white">Login</Text>
                </TouchableOpacity>
            </View>
            }
            {
            !authenticated && user?.providerData[0].providerId === "password" &&
            <View>
                <Text className="mx-5 mt-3 text-base">Enter your password</Text>
                <View className="flex-row items-center">
                    {
                        incorrectPassword ? 
                        <TextInput
                        className="w-2/3 ml-5 mt-2 py-3 px-3 bg-white rounded-lg border border-rose-500"
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry
                        />
                        :
                        <TextInput
                            className="w-2/3 ml-5 mt-2 py-3 px-3 bg-white rounded-lg border border-slate-300"
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                    }
                    <TouchableOpacity 
                        className="p-2 ml-3 bg-green-700 rounded-lg mt-2"
                        onPress={reauthenticateUser}
                    >
                        <Ionicons name='checkmark' size={22} color="white"/>
                    </TouchableOpacity>
                </View>
                {
                    incorrectPassword &&
                    <Text className="mt-1 ml-5 text-rose-500">Incorrect password</Text>
                }
            </View>
            }
            {
            authenticated &&
            <View>
                <Text className="text-lg mx-5 mt-5">Deleting your account means all your data will be removed. This action is permanent and cannot be undone.</Text>
                <View className="h-1/4 mx-5 mt-5">
                    <BouncyCheckbox
                        size={20}
                        fillColor='green'
                        unfillColor='#FFFFFF'
                        text='I understand'
                        iconStyle={{ borderColor: "green" }}
                        textStyle={{textDecorationLine: "none", color: "black", fontSize:18}}
                        onPress={() => setUnderstand(!understand)}
                        isChecked={understand}
                    />
                </View>
            
            </View>
            }
            {
                understand && !loading &&
                <TouchableOpacity 
                    className="w-4/5 mt-7 mx-4 py-4 bg-red-500 rounded-lg justify-end self-center"
                    onPress={deleteAllData}
                >
                    <Text className="text-white font-semibold text-center">Delete Account</Text>
                </TouchableOpacity>
            }
            {
                understand && loading &&
                <ActivityIndicator size={'large'} className="mt-7"/>
            }
        </SafeAreaView>
    );
};

export default DeleteAccount;