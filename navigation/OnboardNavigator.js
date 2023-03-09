import React, { useEffect, useRef, useState } from "react";
import TabNavigator from "./TabNavigator";
import AsyncStorage from '@react-native-async-storage/async-storage';
import LoadingPage from "../Pages/main/LoadingPage";
import OnboardingStack from "./OnboardingStack";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import MatchPage from "../Pages/modals/MatchPage";
import MessagePage from '../Pages/main/MessagePage';
import SettingsPage from '../Pages/main/SettingsPage';
import EditProfilePage from "../Pages/settings/EditProfilePage";
import PreferencesPage from "../Pages/settings/PreferencesPage";
import ChangeSettingsPage from "../Pages/settings/ChangeSettingsPage";
import HelpPage from "../Pages/settings/HelpPage";
import ChangeEmailPage from "../Pages/settings/deepersettings/ChangeEmailPage";
import ChangePasswordPage from "../Pages/settings/deepersettings/ChangePasswordPage";
import DeleteAccountPage from "../Pages/settings/deepersettings/DeleteAccountPage";
import ReauthenticatePage from "../Pages/settings/ReauthenticatePage";
import MatchProfilePage from "../Pages/matches/MatchProfilePage";
import EditImagesPage from "../Pages/settings/EditImagesPage";
import * as Notifications from 'expo-notifications';

Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: false,
      shouldSetBadge: false,
    }),
});

const Stack = createNativeStackNavigator();

export default function OnboardNavigator() {
    const [loading, setLoading] = useState(true);
    const [notification, setNotification] = useState(false);
    const [viewedOnboarding, setViewedOnboarding] = useState(false);
    const notificationListener = useRef();
    const responseListener = useRef();

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

        notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
            setNotification(notification);
        });

        responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
            console.log(response);
        });

        return () => {
            Notifications.removeNotificationSubscription(notificationListener.current);
            Notifications.removeNotificationSubscription(responseListener.current);
        }
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
                <Stack.Screen name="MatchProfile" component={MatchProfilePage} />
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
            <Stack.Group>
                <Stack.Screen name="ChangeEmail" component={ChangeEmailPage} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordPage}/>
                <Stack.Screen name="DeleteAccount" component={DeleteAccountPage}/>
                <Stack.Screen name="Reauthenticate" component={ReauthenticatePage} />
                <Stack.Screen name="EditImages" component={EditImagesPage} />
            </Stack.Group>
        </Stack.Navigator>
    ) : <OnboardingStack />
}