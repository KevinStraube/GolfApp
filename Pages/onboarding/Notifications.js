import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React from 'react'

const Notifications = ({ navigation }) => {
  return (
    <SafeAreaView>
        <Text className="text-xl font-semibold mt-8 self-center">Never miss an opportunity to find your next golf partner</Text>
        <View className="flex-row mt-8 justify-center space-x-3 ">
            <TouchableOpacity className="w-34 bg-slate-300 p-3 rounded-full">
                <Text>Enable Notifications</Text>
            </TouchableOpacity>
            <TouchableOpacity className="w-34 bg-slate-300 p-3 rounded-full">
                <Text>Disable Notifications</Text>
            </TouchableOpacity>
        </View>
        <TouchableOpacity 
                className="mt-60 mx-5 rounded-lg bg-slate-400 p-3 w-20"
                onPress={() => navigation.navigate('Location')}
            >
            <Text className="self-center">Next</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default Notifications;