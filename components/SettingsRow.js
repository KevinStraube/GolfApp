import { View, Text, TouchableOpacity } from 'react-native'
import React from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

const SettingsRow = ({title, icon, page}) => {
    const navigation = useNavigation();

    return (
        <TouchableOpacity 
            className="flex-row items-center justify-between border-b border-slate-300 border-x-0 py-3 px-5"
            onPress={() => navigation.navigate(page)}
        >
            <Text>{title}</Text>
            <Ionicons name={icon} size={20} color="black"/>
        </TouchableOpacity>
    );
};

export default SettingsRow;