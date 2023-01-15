import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "./Pages/LoginPage";
import TabNavigator from "./TabNavigator";
import useAuth from "./hooks/useAuth";

const Stack = createNativeStackNavigator();

const LoginStack = () => {
    const { user } = useAuth();

    return (
        <Stack.Navigator>
            {user ? (
                <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }}/>
            ) : (
                <Stack.Screen name="Login" component={LoginPage} />
            )}
        </Stack.Navigator>
    );
};

export default LoginStack;