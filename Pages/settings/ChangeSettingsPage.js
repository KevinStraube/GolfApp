import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import Header from '../../components/Header';
import SettingsRow from '../../components/SettingsRow';

//List of options within the settings tab
const data = [
    {
        id: 0,
        title: "Change Email",
        icon: "mail-outline",
        page: "Reauthenticate",
    },
    {
        id: 1,
        title: "Change Password",
        icon: "lock-closed-outline",
        page: "ChangePassword",
    },
    {
        id: 2,
        title: "Delete Account",
        icon: "trash-outline",
        page: "DeleteAccount",
    },
];

const ChangeSettingsPage = () => {
    return (
        <SafeAreaView>
            <Header title={"Settings"}/>
            <FlatList
                className="h-full"
                data={data}
                keyExtractor={item => item.id}
                renderItem={({item}) => <SettingsRow title={item.title} icon={item.icon} page={item.page}/>}
            />
        </SafeAreaView>
    );
};

export default ChangeSettingsPage;