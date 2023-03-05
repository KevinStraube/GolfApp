import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    //Sets onboarding on login
    async function setOnboarding() {
        try {
            await AsyncStorage.setItem('@viewedOnboarding', 'true');
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogin = () => {
        setOnboarding();
        //User logs into firebase using email and password
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //Signed in
                const user = userCredential.user;
                console.log("Logged in with: ", user.email);
            })
            //Error handling displays different messages depending on the error code
            .catch((error) => {
                if (error.code === 'auth/invalid-email') {
                    Alert.alert("Error", "Invalid email address");
                }
                else if (error.code === 'auth/wrong-password') {
                    Alert.alert("Error", "Incorrect password");
                }
                else if (error.code === 'auth/internal-error') {
                    Alert.alert("Error", "Password cannot be empty");
                } else {
                    Alert.alert("Error", error);
                }
            })
    }


    return (
        <SafeAreaView className="flex-1 h-full">
            <KeyboardAvoidingView 
                className="flex-1"
                >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1">
                        <View className="flex-2 items-center mt-12">
                            <Text className="text-2xl font-medium">Welcome to Clubhouse Golf</Text>
                        </View>
                        <View className="flex-1 justify-center">
                            <Text className="text-base self-center">Already have an account? Sign in</Text>
                            <TextInput 
                                className="py-3 px-2 rounded-lg bg-white w-4/5 self-center mt-3"
                                placeholder="Email Address" 
                                onChangeText={text => setEmail(text)} 
                                value={email} 
                                keyboardType='email-address'
                            />
                            <TextInput
                                className="py-3 px-2 rounded-lg bg-white w-4/5 self-center mt-3"
                                placeholder="Password"
                                onChangeText={text => setPassword(text)} 
                                secureTextEntry
                            />
                            <TouchableOpacity 
                                className="ml-10 mt-3"
                                onPress={() => navigation.navigate('Reset')}
                            >
                                <Text className="underline">Forgot Password?</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                className="bg-green-600 py-3 px-6 w-4/5 rounded-lg items-center self-center mt-10" 
                                onPress={handleLogin}
                                value={password}
                            >
                                <Text className="text-white font-medium text-base">Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row justify-center mb-2">
                            <Text className="leading-8">Don't have an account? </Text>
                            <TouchableOpacity
                                className="p-2"
                                onPress={() => navigation.navigate('SignUp')}
                                >
                                <Text className="underline font-semibold">Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};





export default LoginPage;