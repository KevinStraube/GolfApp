import React from "react";
import { View, Text } from "react-native";
import useAuth from "../hooks/useAuth";

const LoginPage = () => {
const { user } = useAuth();

console.log(user);

    return (
        <View>
            <Text>Login to the app</Text>
        </View>
    );
};

export default LoginPage;