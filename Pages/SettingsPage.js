import { Alert, FlatList, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'
import Header from '../components/Header';
import SettingsRow from '../components/SettingsRow';
import { getAuth, signOut } from 'firebase/auth';

//List of all settings 
const settingsList = [
  {
    id: 0,
    title: "Edit Profile",
    icon: "pencil",
    page: "EditProfile",
  },
  {
    id: 1,
    title: "Golf Preferences",
    icon: "ios-golf-outline",
    page: "Preferences",
  },
  {
    id: 2,
    title: "Settings",
    icon: "md-settings-outline",
    page: "ChangeSettings",
  },
  {
    id: 3,
    title: "Help Center",
    icon: "help-sharp",
    page: "Help",
  },
];

const SettingsPage = () => {

    //Function to logout user
    const logout = () => {
        Alert.alert("Sign out?", "Are you sure you want to sign out?",[
            {
                text: "Cancel",
                style: "cancel",
            },
            {
                text: "OK",
                onPress: () => {
                    const auth = getAuth();
                    signOut(auth).then(() => {
                        console.log("Signed out successfully");
                    }).catch((error) => {
                        console.log("Error signing out:", error);
                    })
                }
            }
        ]);
    }

    return (
        <SafeAreaView className="flex-1">
          <Header title={"Menu"}/>
          <FlatList
            className="h-full"
            data={settingsList}
            keyExtractor={item => item.id}
            renderItem={({item}) => <SettingsRow title={item.title} icon={item.icon} page={item.page}/>}
          />
          <TouchableOpacity 
            className="bg-white py-4 mx-4 rounded-lg"
            onPress={logout}
          >
            <Text className="text-red-500 font-semibold text-lg text-center">Logout</Text>
          </TouchableOpacity>
        </SafeAreaView>
    );
};

export default SettingsPage;