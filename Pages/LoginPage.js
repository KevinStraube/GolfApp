import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Button } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../firebase';
import { useNavigation } from "@react-navigation/native";

const LoginPage = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

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
                    onChangeText={text => setEmail(text)} 
                    value={email} 
                />
                <TextInput
                    className="py-3 px-2 rounded-lg bg-white w-80"
                    placeholder="Password"
                    onChangeText={text => setPassword(text)} 
                    onPress={handleLogin}
                    secureTextEntry
                />
                <TouchableOpacity
                    className="bg-indigo-600 p-3 self-center rounded-lg" 
                    value={password}
                >
                    <Text className="text-slate-50">Login</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-center">
                <Text className="font-semibold leading-8">Don't have an account? </Text>
                <TouchableOpacity
                    className="bg-indigo-600 p-2 rounded-lg"
                    onPress={() => navigation.navigate('SignUp')}
                    >
                    <Text className="text-slate-50">Sign Up</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};





export default LoginPage;