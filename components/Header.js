import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Foundation, Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const Header = ({title}) => {
    const navigation = useNavigation();
    return (
        <View className="flex-row items-center">
            <TouchableOpacity 
                className="px-2"
                onPress={() => navigation.goBack()}
            >
                <Ionicons name='chevron-back-outline' size={34} color="#FF5864"/>
            </TouchableOpacity>
            <Text className="text-2xl font-bold pl-4">{title}</Text>
        </View>
    );
}

export default Header;