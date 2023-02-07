import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../components/Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';

const MessagePage = () => {
    return (
        <SafeAreaView>
            <Header title="Name"/>
        </SafeAreaView>
    );
};

export default MessagePage;