import { View, Text, TouchableOpacity, Image } from 'react-native'
import React from 'react'
import { useNavigation, useRoute } from '@react-navigation/native';
import { MaterialCommunityIcons } from '@expo/vector-icons';

const MatchPage = () => {
    const navigation = useNavigation();
    const {params} = useRoute();

    const { loggedInUser, userSwiped } = params;

    return (
        <View className="h-full bg-green-500" style={{ opacity: 0.89 }}>
            <View className="mt-12 self-end mx-5">
                <MaterialCommunityIcons name='close' size={40} color="white"/>
            </View>
            <View className="flex-1 justify-center items-center">
                <Text className="text-2xl font-bold text-white">You Matched with {userSwiped.firstName}!</Text>
                <Text className="text-white py-4">Message them and setup a round?</Text>
                <TouchableOpacity 
                    className="bg-white w-4/5 py-8 rounded-full mt-5"
                    onPress={() => {
                        navigation.goBack();
                        navigation.navigate('Chat');
                    }}
                >
                    <Text className="self-center">Send a message</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default MatchPage