import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "../Pages/LoginPage";
import SignUpPage from "../Pages/SignUpPage";

const Stack = createNativeStackNavigator();

const LoginStack = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="SignUp" component={SignUpPage} />
        </Stack.Navigator>
    );
};

export default LoginStack;

//<Stack.Screen name="TabNavigator" component={TabNavigator} options={{ headerShown: false }}/>