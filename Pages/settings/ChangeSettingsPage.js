import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../../components/Header';

const ChangeSettingsPage = () => {
    return (
        <SafeAreaView>
            <Header title={"Settings"}/>
            <Text>Settings Page</Text>
        </SafeAreaView>
    );
};

export default ChangeSettingsPage;