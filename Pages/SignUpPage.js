import { Button, KeyboardAvoidingView, SafeAreaView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons'

const SignUpPage = ({navigation}) => {
    return (
        <SafeAreaView className="flex min-h-screen">
            <Text className="text-xl font-semibold self-center mt-8">We just need to ask a few questions.</Text>
            <Text className="block text-gray-700 mt-10 mx-9">First Name</Text>
            <TextInput className="py-3 px-3 rounded-lg bg-white border-2 border-gray-300 w-80 self-center" />
            <View className="flex-row justify-evenly">
                <TouchableOpacity
                    className="bg-green-200 self-start w-15 mx-8 my-10 p-4 rounded-full"
                >
                    <Ionicons name='arrow-back' size={24} color="#8CDC64" />
                </TouchableOpacity>
                <TouchableOpacity
                    className="bg-green-200 self-end w-15 mx-8 my-10 p-4 rounded-full"
                >
                    <Ionicons name='arrow-forward' size={24} color="#8CDC64" />
                </TouchableOpacity>
            </View>
            <TouchableOpacity 
                    className="bg-indigo-600 w-30 self-center p-2 rounded-lg my-20"
                    onPress={() => navigation.navigate('Login')}
                >
                <Text className="self-center text-slate-50">Back to login</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SignUpPage;
