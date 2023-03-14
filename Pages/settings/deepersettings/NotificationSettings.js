import { View, Text, SafeAreaView, TouchableOpacity, Platform, Alert } from 'react-native'
import React, { useState, useEffect } from 'react'
import Header from '../../../components/Header';
import * as Notifications from 'expo-notifications';
import * as Device from 'expo-device';
import { doc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../../firebase';

const NotificationSettings = () => {
    const [token, setToken] = useState('');
    const user = auth.currentUser;

    async function getNotificationPermissionStatus() {
        const settings = await Notifications.getPermissionsAsync();

        if (settings.granted || settings.ios?.status === Notifications.IosAuthorizationStatus.PROVISIONAL) {
            Alert.alert('You have already enabled notifications');
            return;
        } else {
            registerForPushNotificationsAsync();
        }

    }

    async function registerForPushNotificationsAsync() {
        let token;
    
        if (Platform.OS === 'android') {
            await Notifications.setNotificationChannelAsync('default', {
                name: 'default',
                importance: Notifications.AndroidImportance.MAX,
                vibrationPattern: [0, 250, 250, 250],
                lightColor: '#FF231F7C',
            });
        }
    
        if (Device.isDevice) {
            const { status: existingStatus } = await Notifications.getPermissionsAsync();
            let finalStatus = existingStatus;
            if (existingStatus !== 'granted') {
                const { status } = await Notifications.requestPermissionsAsync();
                finalStatus = status;
            } else {
                Alert.alert('You already have notifications enabled');
                return;
            }

            if (finalStatus !== 'granted') {
                alert('Notifications disabled. Please re-enable to recieve notifications.');
                return;
            }
            const appConfig = require('../../../app.json');
            const projectId = appConfig?.expo?.extra?.eas?.projectId;
            token = (await Notifications.getExpoPushTokenAsync({
                projectId
            })).data;
    
        } else {
            alert('Must use physical device');
        }
    
        setToken(token);
    }

    useEffect(() => {
        if (token) {
            updateDoc(doc(firestore, 'users', user.uid), 
                {
                    notificationToken: token,
                }
            )
            console.log("Updated token:", token);
        }
    }, [token]);

    return (
    <SafeAreaView className="h-1/2">
        <Header title={"Notifications"}/>
        <View className="flex-1 justify-center">
            <TouchableOpacity 
                className="mx-8 p-4 bg-green-700 items-center rounded-full"
                onPress={getNotificationPermissionStatus}
            >
                <Text className="text-white">Enable Notifications</Text>
            </TouchableOpacity>
        </View>
    </SafeAreaView>
    );
};

export default NotificationSettings;