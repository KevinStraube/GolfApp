import React from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import LoginPage from "./Pages/LoginPage";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();
const user = null;

const LoginStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            {user ? (
                <Stack.Screen name="Main" component={TabNavigator} options={{ headerShown: false }}/>
            ) : (
                <Stack.Screen name="Login" component={LoginPage} />
            )}
        </Stack.Navigator>
    );
};

export default LoginStack;