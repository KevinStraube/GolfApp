import React, { useEffect, useState } from "react";
import TabNavigator from "./TabNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingPage from "../Pages/LoadingPage";
import OnboardingStack from "./OnboardingStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MatchPage from "../Pages/modals/MatchPage";
import MessagePage from '../Pages/MessagePage';
import SettingsPage from '../Pages/SettingsPage';
import EditProfilePage from "../Pages/settings/EditProfilePage";
import PreferencesPage from "../Pages/settings/PreferencesPage";
import ChangeSettingsPage from "../Pages/settings/ChangeSettingsPage";
import HelpPage from "../Pages/settings/HelpPage";

const Stack = createNativeStackNavigator();

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
            console.log("Error @checkOnboarding:", error);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        checkOnboarding();
    }, []);
    
    /* 
    * Display loading if in loading state
    * If viewed onboarding, go to home page with modal built-in to the main stack
    * If user has not viewed onboarding, go to the onboarding stack navigator
    */
    return loading ? <LoadingPage /> : viewedOnboarding ? (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen name="Main" component={TabNavigator} options={{gestureEnabled: false}}/>
                <Stack.Screen name="Message" component={MessagePage} />
                <Stack.Screen name="Settings" component={SettingsPage} />
            </Stack.Group>
            <Stack.Group screenOptions={{ presentation: "transparentModal" }}>
                <Stack.Screen name="Match" component={MatchPage}/>
            </Stack.Group>
            <Stack.Group>
                <Stack.Screen name="EditProfile" component={EditProfilePage}/>
                <Stack.Screen name="Preferences" component={PreferencesPage}/>
                <Stack.Screen name="ChangeSettings" component={ChangeSettingsPage}/>
                <Stack.Screen name="Help" component={HelpPage}/>
            </Stack.Group>
        </Stack.Navigator>
    ) : <OnboardingStack />
}