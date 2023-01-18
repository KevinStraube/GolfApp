import React, { useEffect, useState } from "react";
import { View, Text, TextInput, Pressable, Alert } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../firebase';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                console.log("Authenticated as", user.email);
            }
        })
        return unsubscribe
    }, [])

    const handleSignUp = () => {
        createUserWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //Signed in
                const user = userCredential.user;
                console.log("Registered with: ", user.email);
            })
            .catch((error) => alert(error.message))
    }

    const handleLogin = () => {
        signInWithEmailAndPassword(auth, email, password)
            .then((userCredential) => {
                //Signed in
                const user = userCredential.user;
                console.log("Logged in with: ", user.email);
            })
            .catch((error) => alert(error.message))
    }

    return (
        <SafeAreaView className="h-full">
            <View className="pt-12 items-center">
                <View className="bg-blue-200 px-3 py-1 rounded-full">
                    <Text className="text-lg text-blue-800 font-semibold">Login Page</Text>
                </View>
            </View>
            <View className="flex-auto justify-center items-center gap-3">
                <TextInput 
                    className="py-3 px-2 rounded-lg bg-white w-80"
                    placeholder="Email" 
                    value={email} 
                    onChangeText={text => setEmail(text)} 
                />
                <TextInput
                    className="py-3 px-2 rounded-lg bg-white w-80"
                    placeholder="Password"
                    value={password}
                    onChangeText={text => setPassword(text)} 
                    secureTextEntry
                />
                <Pressable 
                    accessibilityRole="button"
                    className="bg-indigo-600 p-3 self-center rounded-lg" 
                    onPress={handleLogin}
                >
                    <Text className="text-slate-50">Login</Text>
                </Pressable>
                <Pressable 
                    className="bg-indigo-600 p-3 self-center rounded-lg"
                    onPress={handleSignUp}
                    >
                    <Text className="text-slate-50">Sign Up</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default LoginPage;