import React, { useEffect, useState } from "react";
import TabNavigator from "./TabNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingPage from "../Pages/LoadingPage";
import OnboardingStack from "./OnboardingStack";

export default function OnboardNavigator() {
    const [loading, setLoading] = useState(true);
    const [viewedOnboarding, setViewedOnboarding] = useState(false);

    const checkOnboarding = async () => {
        try {
            const value = await AsyncStorage.getItem('@viewedOnboarding');
    
            if (value !== null) {
                setViewedOnboarding(true);
            }
        } catch (error) {
            console.log('Error @checkOnboarding', error)
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkOnboarding();
    }, [])

    return loading ? <LoadingPage /> : viewedOnboarding ? <TabNavigator /> : <OnboardingStack />
}