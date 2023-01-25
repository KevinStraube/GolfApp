import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../Pages/HomePage";
import { Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import ProfilePage from "../Pages/ProfilePage";
import ChatPage from "../Pages/ChatPage";

const Tab = createBottomTabNavigator();

const TabNavigator = ({ navigation }) => {
    return (
        <Tab.Navigator screenOptions={{ headerShown: false }}>
            <Tab.Screen
                name="HomePage" 
                component={HomePage} 
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: () => (
                        <Ionicons name="home" size={24} color="grey" />
                    )
                }}
            />
            
            <Tab.Screen 
                name="Chat" 
                component={ChatPage} 
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="chat" size={24} color="grey" />
                    )
                }}
            />

            <Tab.Screen 
                name="Profile" 
                component={ProfilePage} 
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: () => (
                        <MaterialCommunityIcons name="face-man" size={24} color="grey" />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;