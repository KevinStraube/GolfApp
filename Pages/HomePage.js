import React from "react";
import { View, Text, Button, SafeAreaView } from "react-native";
import { auth } from '../firebase';
import { Ionicons } from '@expo/vector-icons';

const HomePage = () => {

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                console.log("Signed out.")
            })
            .catch(error => alert(error.message))
    }

    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <View className="flex-row items-center">
                <Ionicons name="golf-sharp" size={30} color="blue" />
            </View>
            <View className="flex-1 -mt-6">
                <Text className="flex-1 justify-center items-center">Email: {auth.currentUser?.email}</Text>
                <Button title="Log out" onPress={handleSignOut}/>
            </View>
        </SafeAreaView>
    );
};

export default HomePage;