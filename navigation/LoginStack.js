import React, { useState, useEffect } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "../Pages/main/LoginPage";
import SignUpPage from "../Pages/main/SignUpPage";
import PasswordResetPage from "../Pages/settings/PasswordResetPage";
import LoadingPage from "../Pages/main/LoadingPage";
import { useAuth } from "../hooks/useAuth";

const Stack = createNativeStackNavigator();

const LoginStack = () => {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        setLoading(false);
    }, [user]);

    return loading ? <LoadingPage /> :
    (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginPage} />
            <Stack.Screen name="SignUp" component={SignUpPage} />
            <Stack.Screen name="Reset" component={PasswordResetPage} />
        </Stack.Navigator>
    );
};

export default LoginStack;