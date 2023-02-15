import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React from 'react'

const PreferencesPage = () => {

    return (
        <SafeAreaView className="flex-1">
            <Text className="self-center font-semibold text-2xl mt-4">Golf Preferences</Text>
            
            <Text className="mt-10 mx-5 text-base font-bold">Genders you would like to play with</Text>
            <Text className="mt-1 mx-5">(Select all that apply)</Text>



            <Text className="mt-8 mx-5">Last Name</Text>
            <TextInput 
                className="bg-white w-80 rounded-lg p-2 mx-5 my-2" 
                
            />
            <Text className="mt-8 mx-5">Date of Birth (mm/dd/yyyy)</Text>

            <Text className="mt-8 mx-5">Gender</Text>

            <TouchableOpacity 
                className="mt-8 self-end mx-5 rounded-lg bg-slate-400 p-3 w-20"
            >
                <Text className="self-center">Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default PreferencesPage;