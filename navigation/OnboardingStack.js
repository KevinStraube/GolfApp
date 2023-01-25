import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from "../registration/Onboarding";
import BasicInfoPage from "../Pages/onboarding/BasicInfoPage";
import NotificationPage from "../Pages/onboarding/NotificationPage";
import LocationPage from '../Pages/onboarding/LocationPage';
import ImagesPage from "../Pages/onboarding/ImagesPage";
import PromptPage from "../Pages/onboarding/PromptPage";
import TabNavigator from "./TabNavigator";

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="BasicInfo" component={BasicInfoPage} />
            <Stack.Screen name="Notifications" component={NotificationPage} />
            <Stack.Screen name="Location" component={LocationPage} />
            <Stack.Screen name="Images" component={ImagesPage} />
            <Stack.Screen name="Prompts" component={PromptPage} />
            <Stack.Screen name="Home" component={TabNavigator} options={{gestureEnabled: false}}/>
        </Stack.Navigator>
    );
};

export default OnboardingStack;