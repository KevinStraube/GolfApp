import React, { useState } from "react";
import { View, Text, KeyboardAvoidingView, TextInput, Button, Pressable, Alert } from "react-native";
import { styled } from 'nativewind';
import { SafeAreaView } from "react-native-safe-area-context";

const LoginPage = () => {
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');

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
                    onPress={() => Alert.alert('Logged In')}
                >
                    <Text className="text-slate-50">Login</Text>
                </Pressable>
                <Pressable className="bg-indigo-600 p-3 self-center rounded-lg">
                    <Text className="text-slate-50">Sign Up</Text>
                </Pressable>
            </View>
        </SafeAreaView>
    );
};

export default LoginPage;