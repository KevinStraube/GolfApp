import { FlatList, SafeAreaView, StyleSheet, Text, View } from 'react-native'
import React from 'react'
import Header from '../components/Header';
import SettingsRow from '../components/SettingsRow';

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
    return (
        <SafeAreaView>
          <Header title={"Settings"}/>
          <FlatList
            className="h-full"
            data={settingsList}
            keyExtractor={item => item.id}
            renderItem={({item}) => <SettingsRow title={item.title} icon={item.icon}/>}
          />
        </SafeAreaView>
    );
};

export default SettingsPage;