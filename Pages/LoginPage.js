import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const LoginPage = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    async function setOnboarding() {
        try {
            await AsyncStorage.setItem('@viewedOnboarding', 'true');
        } catch (error) {
            console.log(error);
        }
    }

    const handleLogin = () => {
        setOnboarding();
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //Signed in
                const user = userCredential.user;
                console.log("Logged in with: ", user.email);
            })
            .catch((error) => alert(error.message))
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
                        <View className="flex-1 justify-center items-center gap-3">
                            <Text className="text-base">Already have an account? Sign in</Text>
                            <TextInput 
                                className="py-3 px-2 rounded-lg bg-white w-4/5"
                                placeholder="Email Address" 
                                onChangeText={text => setEmail(text)} 
                                value={email} 
                                keyboardType='email-address'
                            />
                            <TextInput
                                className="py-3 px-2 rounded-lg bg-white w-4/5"
                                placeholder="Password"
                                onChangeText={text => setPassword(text)} 
                                secureTextEntry
                            />
                            <TouchableOpacity
                                className="bg-lime-500 py-3 px-6 self-center rounded-lg" 
                                onPress={handleLogin}
                                value={password}
                            >
                                <Text className="text-white font-medium text-base">Sign In</Text>
                            </TouchableOpacity>
                        </View>
                        <View className="flex-row justify-center mb-2">
                            <Text className="font-semibold leading-8">Don't have an account? </Text>
                            <TouchableOpacity
                                className="bg-lime-500 p-2 rounded-lg"
                                onPress={() => navigation.navigate('SignUp')}
                                >
                                <Text className="text-white">Sign Up</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};





export default LoginPage;