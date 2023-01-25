import React from "react";
import { View, Text, SafeAreaView, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";



const ProfilePage = () => {
    const resetOnboarding = async () => {
        try {
            await AsyncStorage.removeItem('@viewedOnboarding');
            console.log("Removed @viewedonboarding");
        } catch (error) {
            console.log("Error removing @viewedOnboarding to AsyncStorage: ", error);
        }
    }

    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <Button title="Reset Onboarding" onPress={resetOnboarding}/>
        </SafeAreaView>
    );
};

export default ProfilePage;