import { View, Text, SafeAreaView, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { useAuth } from '../hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Ionicons, Feather } from '@expo/vector-icons';
import PopupMenu from './modals/PopupMenu';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import MatchChatPage from './matches/MatchChatPage';
import MatchProfilePage from './matches/MatchProfilePage';

const Tab = createMaterialTopTabNavigator();

const MessagePage = ({ navigation }) => {
    const { user } = useAuth();
    const { params } = useRoute();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

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
                        <PopupMenu matchDetails={matchDetails}/>
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
            
        </SafeAreaView>
    );
};

export default MessagePage;