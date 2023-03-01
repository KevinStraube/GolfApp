import { Button, KeyboardAvoidingView, SafeAreaView, Alert, Text, TextInput, TouchableOpacity, View, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import { createUserWithEmailAndPassword, sendEmailVerification } from 'firebase/auth';
import { auth } from '../firebase';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { AntDesign } from '@expo/vector-icons';

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

    const handleSignUp = () => {
        if (password != confirmPassword) {
            Alert.alert(
                "Error",
                "Passwords do not match"
            );
        } else {
            removeOnboarding();
            createUserWithEmailAndPassword(auth, email, password)
                .then((userCredential) => {
                    //Signed in
                    const user = userCredential.user;
                    console.log("Registered with: ", user.email);

                    sendEmailVerification(user).catch((error) => {
                        console.log("Error sending email:", error);
                    });
                })
                .catch((error) => alert(error.message))
        }
    }

    const showEmailInfo = () => {
        setEmailFields(!emailFields);
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
                                    className="bg-lime-500 py-5 self-center rounded-full w-2/3 items-center" 
                                    onPress={showEmailInfo}
                                >
                                    <Text className="text-white font-medium text-base">Sign up with email</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    className="bg-white py-5 self-center rounded-full w-2/3 items-center border border-black" 
                                    onPress={showEmailInfo}
                                >
                                    <View className="flex-row justify-between gap-x-3">
                                        <AntDesign name='google' size={24} color='black'/>
                                        <Text className="text-black font-medium text-base">Sign up with Google</Text>
                                    </View>
                            </TouchableOpacity>
                            <TouchableOpacity
                                    className="bg-white py-5 self-center rounded-full w-2/3 items-center border border-black" 
                                    onPress={showEmailInfo}
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
                                    className="bg-lime-500 p-3 self-center rounded-lg" 
                                    onPress={handleSignUp}
                                >
                                    <Text className="text-white font-medium text-base">Create Account</Text>
                                </TouchableOpacity>
                                <TouchableOpacity
                                    className="bg-white p-3 self-center rounded-lg border-black border" 
                                    onPress={showEmailInfo}
                                >
                                    <Text className="text-black font-medium text-base">Back to sign up methods</Text>
                                </TouchableOpacity>
                            </View>
                        }
                        <View className="flex-row justify-center mb-2">
                            <TouchableOpacity
                                className="bg-lime-500 p-2 rounded-lg"
                                onPress={() => navigation.navigate("Login")}
                                >
                                <Text className="text-white">Back to Login</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default SignUpPage;
