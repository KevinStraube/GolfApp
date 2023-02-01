import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../Pages/HomePage";
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
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
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="home" size={24} color={ focused ? "black" : "grey" }/>
                    )
                }}
            />
            
            <Tab.Screen 
                name="Chat" 
                component={ChatPage} 
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => (
                        <MaterialCommunityIcons name="chat" size={24} color={ focused ? "black" : "grey" } />
                    )
                }}
            />

            <Tab.Screen 
                name="Profile" 
                component={ProfilePage} 
                options={{
                    tabBarShowLabel: false,
                    tabBarIcon: ({ focused }) => (
                        <AntDesign name="user" size={24} color={ focused ? "black" : "grey" } />
                    )
                }}
            />
        </Tab.Navigator>
    );
};

export default TabNavigator;