import { View, Text, SafeAreaView, FlatList } from 'react-native'
import React from 'react'
import Header from '../../components/Header';
import SettingsRow from '../../components/SettingsRow';

const data = [
    {
        id: 0,
        title: "Change email",
        icon: "mail-outline",
        page: "ChangeEmail",
    },
    {
        id: 1,
        title: "Change password",
        icon: "lock-closed-outline",
        page: "ChangePassword",
    },
    {
        id: 2,
        title: "Delete account",
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