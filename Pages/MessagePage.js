import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { useAuth } from '../hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import { Ionicons, Feather } from '@expo/vector-icons';
import PopupMenu from './modals/PopupMenu';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MatchChatPage from './matches/MatchChatPage';
import MatchProfilePage from './matches/MatchProfilePage';
import ActionSheet from 'react-native-actionsheet';

const Tab = createMaterialTopTabNavigator();

const MessagePage = ({ navigation }) => {
    const { user } = useAuth();
    const { params } = useRoute();
    let actionSheet = useRef();

    let options = [
        'Share Profile', 'Unmatch', 'Report', 'Cancel'
    ];

    const showActionSheet = () => {
        actionSheet.current.show();
    }

    const { matchDetails } = params;

    return (
        <SafeAreaView className="flex-1">
            <View className="flex">
                <View className="flex-row items-center">
                    <TouchableOpacity
                        className="px-2"
                        onPress={() => navigation.goBack()}
                    >
                        <Ionicons name='chevron-back-outline' size={34} color="#71C547"/>
                    </TouchableOpacity>

                    <Text className="text-2xl font-bold pl-4">{getMatchedUserInfo(matchDetails.users, user?.uid).firstName}</Text>

                    <View className="ml-auto px-5">
                    <TouchableOpacity onPress={showActionSheet}>
                        <Feather name='more-horizontal' size={32} color="black" />
                    </TouchableOpacity>
                    </View>
                </View>
            </View>

            <Tab.Navigator
                screenOptions={{
                    tabBarActiveTintColor: 'black',
                    tabBarStyle: {backgroundColor: "transparent"},
                    tabBarLabelStyle: {textTransform: "none"},
                    tabBarIndicatorStyle: {
                        backgroundColor: "black",
                    },
                }}
            >
                <Tab.Screen name='Chat' component={MatchChatPage} initialParams={{matchDetails: matchDetails}}/>
                <Tab.Screen name='Profile' component={MatchProfilePage} initialParams={{matchDetails: matchDetails}}/>
            </Tab.Navigator>
            
            <ActionSheet
                ref={actionSheet}
                options={options}
                cancelButtonIndex={3}
                onPress={(index) => {
                    alert(options[index]);
                }}
            />
        </SafeAreaView>
    );
};

export default MessagePage;