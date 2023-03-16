import React, { useEffect, useState } from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import HomePage from "../Pages/main/HomePage";
import { Ionicons, MaterialCommunityIcons, AntDesign } from '@expo/vector-icons';
import ProfilePage from "../Pages/main/ProfilePage";
import ChatPage from "../Pages/main/ChatPage";
import { auth, firestore } from "../firebase";
import { doc, onSnapshot } from "firebase/firestore";

const Tab = createBottomTabNavigator();

const TabNavigator = () => {
    const [unreadMessages, setUnreadMessages] = useState(true);
    const user = auth.currentUser;
    
    useEffect(() => {
        let unsubscribe;

        const getMessageCount = () => {
            unsubscribe = onSnapshot(doc(firestore, 'users', user.uid), (doc) => {
                setUnreadMessages(doc.data().unreadMessages)
            })
        }
        getMessageCount();

        return unsubscribe;
    }, []);

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
                    tabBarBadge: unreadMessages > 0 ? unreadMessages : null,
                    tabBarBadgeStyle: {backgroundColor: "red"},
                    tabBarIcon: ({ focused }) => (
                        <Ionicons name="chatbubbles" size={24} color={ focused ? "black" : "grey" } />
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