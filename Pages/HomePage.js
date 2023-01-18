import { useNavigation } from "@react-navigation/native";
import React from "react";
import { View, Text, Button } from "react-native";
import { auth } from '../firebase';

const HomePage = () => {
    const navigation = useNavigation();

    const handleSignOut = () => {
        auth.signOut()
            .then(() => {
                navigation.replace("Login");
            })
            .catch(error => alert(error.message))
    }

    return (
        <View className="flex-1 justify-center items-center">
            <Text>Email: {auth.currentUser?.email}</Text>
            <Button title="Log out" onPress={handleSignOut}/>
        </View>
    );
};

export default HomePage;