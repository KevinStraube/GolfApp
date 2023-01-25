import { Platform, SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';

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
        }
        if (finalStatus !== 'granted') {
            alert('Notifications disabled. Please re-enable to recieve notifications.');
            return;
        }
        token = (await Notifications.getExpoPushTokenAsync()).data;
        console.log("Push token: ", token);
    } else {
        alert('Must use physical device');
    }

    return token;
}

const NotificationPage = ({ navigation }) => {
    const [valid, setValid] = useState(false);

    const handleNotifications = () => {
        registerForPushNotificationsAsync();
        navigation.navigate('Location');
    } 

    const handleDisableNotifications = () => {
        alert('Notifications disabled');
        navigation.navigate('Location');
    }

    return (
        <SafeAreaView>
            <Text className="text-xl font-semibold mt-8 self-center">Never miss an opportunity to find your next golf partner</Text>
            <View className="flex-row mt-8 justify-center space-x-3 ">
                <TouchableOpacity 
                    className="w-34 bg-slate-300 p-3 rounded-full"
                    onPress={handleNotifications}
                    >
                    <Text>Enable Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-34 bg-slate-300 p-3 rounded-full"
                    onPress={handleDisableNotifications}
                    >
                    <Text>Disable Notifications</Text>
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-around">
                <TouchableOpacity 
                    className="mt-60 rounded-lg bg-slate-400 p-3 w-20"
                    onPress={() => navigation.navigate('BasicInfo')}>
                    <Text className="self-center">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                        className="mt-60 rounded-lg bg-slate-400 p-3 w-20"
                        onPress={() => navigation.navigate('Location')}
                    >
                    <Text className="self-center">Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default NotificationPage;