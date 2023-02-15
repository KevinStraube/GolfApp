import React, { useState } from "react";
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Onboarding from "../registration/Onboarding";
import BasicInfoPage from "../Pages/onboarding/BasicInfoPage";
import NotificationPage from "../Pages/onboarding/NotificationPage";
import LocationPage from '../Pages/onboarding/LocationPage';
import ImagesPage from "../Pages/onboarding/ImagesPage";
import PromptPage from "../Pages/onboarding/PromptPage";
import TabNavigator from "./TabNavigator";
import MatchPage from "../Pages/modals/MatchPage";
import PreferencesOnboardingPage from "../Pages/onboarding/PreferencesPage";
import MessagePage from '../Pages/MessagePage';
import SettingsPage from '../Pages/SettingsPage';
import EditProfilePage from "../Pages/settings/EditProfilePage";
import PreferencesPage from "../Pages/settings/PreferencesPage";
import ChangeSettingsPage from "../Pages/settings/ChangeSettingsPage";
import HelpPage from "../Pages/settings/HelpPage";
import ChangeEmailPage from "../Pages/settings/deepersettings/ChangeEmailPage";
import ChangePasswordPage from "../Pages/settings/deepersettings/ChangePasswordPage";
import DeleteAccountPage from "../Pages/settings/deepersettings/DeleteAccountPage";
import ReauthenticatePage from "../Pages/settings/ReauthenticatePage";

const Stack = createNativeStackNavigator();

const OnboardingStack = () => {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Group>
                <Stack.Screen name="Onboarding" component={Onboarding} />
                <Stack.Screen name="BasicInfo" component={BasicInfoPage} />
                <Stack.Screen name="PreferencesOnboarding" component={PreferencesOnboardingPage} />
                <Stack.Screen name="Notifications" component={NotificationPage} />
                <Stack.Screen name="Location" component={LocationPage} />
                <Stack.Screen name="Images" component={ImagesPage} />
                <Stack.Screen name="Prompts" component={PromptPage} />
            </Stack.Group>

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

            <Stack.Group>
                <Stack.Screen name="ChangeEmail" component={ChangeEmailPage} />
                <Stack.Screen name="ChangePassword" component={ChangePasswordPage}/>
                <Stack.Screen name="DeleteAccount" component={DeleteAccountPage}/>
                <Stack.Screen name="Reauthenticate" component={ReauthenticatePage} />
            </Stack.Group>
        </Stack.Navigator>
    );
};

export default OnboardingStack;