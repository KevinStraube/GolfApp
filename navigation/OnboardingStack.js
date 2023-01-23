import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from "../registration/Onboarding";
import BasicInfoPage from "../Pages/onboarding/BasicInfoPage";
import Notifications from "../Pages/onboarding/Notifications";
import LocationPage from '../Pages/onboarding/LocationPage';
import ImagesPage from "../Pages/onboarding/ImagesPage";

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {

    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Onboarding" component={Onboarding} />
            <Stack.Screen name="BasicInfo" component={BasicInfoPage} />
            <Stack.Screen name="Notifications" component={Notifications} />
            <Stack.Screen name="Location" component={LocationPage} />
            <Stack.Screen name="Images" component={ImagesPage} />
        </Stack.Navigator>
    );
};

export default OnboardingStack;