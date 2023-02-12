import { View, Text, TouchableOpacity, KeyboardAvoidingView, Platform } from 'react-native'
import React from 'react'
import { Foundation, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({title}) => {
    const navigation = useNavigation();
    return (
        <View className="flex-row items-center border-b border-slate-300 pb-3">
            <TouchableOpacity 
                className="px-2"
                onPress={() => navigation.goBack()}
            >
                <Ionicons name='chevron-back-outline' size={34} color="#71C547"/>
            </TouchableOpacity>

            <Text className="text-2xl font-bold pl-4">{title}</Text>
        </View>
    );
}

export default Header;