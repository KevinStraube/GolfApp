import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Device from 'expo-device';

const Notifications = ({ navigation }) => {
    const [enableNotifications, setEnableNotifications] = useState(false);

    return (
        <SafeAreaView>
            <Text className="text-xl font-semibold mt-8 self-center">Never miss an opportunity to find your next golf partner</Text>
            <View className="flex-row mt-8 justify-center space-x-3 ">
                <TouchableOpacity 
                    className="w-34 bg-slate-300 p-3 rounded-full"
                    onPress={setEnableNotifications}
                    >
                    <Text>Enable Notifications</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="w-34 bg-slate-300 p-3 rounded-full"
                    onPress={setEnableNotifications}
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

export default Notifications;