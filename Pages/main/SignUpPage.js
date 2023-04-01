import { Button, KeyboardAvoidingView, SafeAreaView, Alert, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification, GoogleAuthProvider, signInWithCredential, FacebookAuthProvider } from 'firebase/auth';
import { auth, firestore } from '../../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';
//import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { LoginManager, AccessToken } from 'react-native-fbsdk-next';
import { doc, getDoc } from 'firebase/firestore';
import { GOOGLE_WEB_CLIENT_ID, GOOGLE_IOS_CLIENT_ID } from '@env';

/**
 * Function to remove device onboarding state
 * Once removed, user will be shown the onboarding screens until they have completed the full flow
 */
async function removeOnboarding() {
    try {
        await AsyncStorage.removeItem('@viewedOnboarding');
    } catch (error) {
        console.log("Error storing @viewedOnboarding to AsyncStorage: ", error);
    }
}

const SignUpPage = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [emailFields, setEmailFields] = useState(false);

    //User signs up using email/password
    //Fires when user presses create account button
    const handleSignUp = () => {
        //Error handler when password and confirm password fields do not match
        if (password != confirmPassword) {
            Alert.alert(
                "Error",
                "Passwords do not match"
            );
        } else {
            //Passwords match, remove onboarding
            removeOnboarding();
            //Create new user in firebase
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    //Once the user has been created
                    const user = userCredential.user;
                    console.log("Registered with: ", user.email);

                    //Send email to user to verify their account
                    sendEmailVerification(user).catch((error) => {
                        console.log("Error sending email:", error);
                    });
                })
                //Cases of error handling using error codes to display different error messages
                .catch((error) => {
                    if (error.code === 'auth/invalid-email') {
                        Alert.alert("Error", "Invalid email address");
                    }
                    else if (error.code === 'auth/internal-error') {
                        Alert.alert("Error", "Password cannot be empty");
                    }
                    else if (error.code === 'auth/weak-password') {
                        Alert.alert("Password too short", "Passwords must be at least 6 characters");
                    }
                    else if (error.code === 'auth/missing-email') {
                        Alert.alert("Error", "Email field cannot be empty");
                    } else {
                        Alert.alert("Error", error.code);
                    }
                })
        }
    }

    //Show or hide sign up methods 
    const showEmailInfo = () => {
        setEmailFields(!emailFields);
    }

    /*
    //User signs up with Google
    const googleSignUp = async () => {
        //Set client IDs with app information from Google Cloud Console
        GoogleSignin.configure({
            webClientId: GOOGLE_WEB_CLIENT_ID,
            iosClientId: GOOGLE_IOS_CLIENT_ID,
        });

        await GoogleSignin.hasPlayServices({ showPlayServicesUpdateDialog: true });
        const provider = new GoogleAuthProvider();

        //Get credential from GoogleSignIn library
        const { idToken } = await GoogleSignin.signIn();
        const googleCredential = GoogleAuthProvider.credential(idToken);
        //Sign into Firebase using generated credential
        signInWithCredential(auth, googleCredential)
        .catch((error) => {
            console.log("Error creating user with Google", error);
        });
    }
    */

    const googleSignUp = () => {
        console.log("Google");
    }

    //User signs up with Facebook
    const facebookSignUp = async () => {
        //Display Facebook login screen
        const result = await LoginManager.logInWithPermissions(['public_profile', 'email'])
            .catch((error) => {
                console.log(error);
            });

        if (result.isCancelled) {
            console.log("user cancelled the login process");
            return;
        }

        //Get user's access token
        const data = await AccessToken.getCurrentAccessToken();

        if (!data) {
            console.log("Error fetching access token");
        } else {
            //Get Facebook credential based on access token
            const facebookCredential = FacebookAuthProvider.credential(data.accessToken);

            //Sign into Firebase using generated credential
            const response = await signInWithCredential(auth, facebookCredential)
                .then(async () => {
                    const userDoc = await getDoc(doc(firestore, 'users', auth.currentUser.uid));
                    if (!userDoc.exists()) {
                        removeOnboarding();
                    } else {
                        console.log("user already exists");
                    }
                    
                })
                .catch((error) => {
                    console.log("Error creating user with Facebook:", error);
                });
            
            console.log(response);
        }
    }

    return (
        <SafeAreaView className="h-full">
            <KeyboardAvoidingView className="flex-1">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1">
                        <View className="pt-12 items-center">
                            <Text className="font-semibold text-2xl">Sign Up</Text>
                        </View>
                        {
                        !emailFields &&
                        <View className="flex-auto justify-center items-center gap-3">
                            <TouchableOpacity
                                    className="bg-green-700 py-5 self-center rounded-full w-2/3 items-center" 
                                    onPress={showEmailInfo}
                                >
                                    <Text className="text-white font-medium text-base">Sign up with email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    className="bg-white py-5 self-center rounded-full w-2/3 items-center border border-black" 
                                    onPress={googleSignUp}
                                >
                                    <View className="flex-row justify-between gap-x-3">
                                        <AntDesign name='google' size={24} color='black'/>
                                        <Text className="text-black font-medium text-base">Sign up with Google</Text>
                                    </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    className="bg-white py-5 self-center rounded-full w-2/3 items-center border border-black" 
                                    onPress={facebookSignUp}
                                >
                                    <View className="flex-row justify-between gap-x-3">
                                        <AntDesign name='facebook-square' size={24} color='black'/>
                                        <Text className="text-black font-medium text-base">Sign up with Facebook</Text>
                                    </View>
                            </TouchableOpacity>
                        </View>
                        }
                        {
                        emailFields &&
                            <View className="flex-auto justify-center items-center gap-3">
                                <TextInput 
                                    className="py-3 px-2 rounded-lg bg-white w-4/5"
                                    placeholder="Email Address" 
                                    onChangeText={setEmail}
                                    keyboardType="email-address"
                                />
                                <TextInput
                                    className="py-3 px-2 rounded-lg bg-white w-4/5"
                                    placeholder="Password"
                                    onChangeText={setPassword}
                                    secureTextEntry
                                />
                                <TextInput
                                    className="py-3 px-2 rounded-lg bg-white w-4/5"
                                    placeholder="Confirm Password"
                                    onChangeText={setConfirmPassword}
                                    secureTextEntry
                                />
                                <TouchableOpacity
                                    className="bg-green-700 p-3 self-center rounded-lg" 
                                    onPress={handleSignUp}
                                >
                                    <Text className="text-white font-medium text-base">Create Account</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="p-3 self-center rounded-lg" 
                                    onPress={showEmailInfo}
                                >
                                    <Text className="text-black font-medium text-base underline">Back to sign up methods</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <View className="flex-row justify-center mb-2">
                            <TouchableOpacity
                                className="p-2"
                                onPress={() => navigation.navigate("Login")}
                                >
                                <Text className="font-semibold underline">Back to Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpPage;
