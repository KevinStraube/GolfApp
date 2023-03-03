import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "../Pages/LoginPage";
import SignUpPage from "../Pages/SignUpPage";
import PasswordResetPage from "../Pages/settings/PasswordResetPage";

const Stack = createNativeStackNavigator();

const LoginStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="SignUp" component={SignUpPage} />
            <Stack.Screen name="Reset" component={PasswordResetPage} />
        </Stack.Navigator>
    );
};

export default LoginStack;