import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Foundation, Ionicons } from '@expo/vector-icons';

const Header = ({title}) => {
    return (
        <View className="flex-row">
            <TouchableOpacity className="p-2">
                <Ionicons name='chevron-back-outline' size={34} color="#FF5864"/>
            </TouchableOpacity>
            <Text className="text-2xl font-bold pl-2">{title}</Text>
        </View>
    );
}

export default Header;