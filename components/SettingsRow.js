import { View, Text, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';

const SettingsRow = ({title, icon, page}) => {
    const [provider, setProvider] = useState('');
    const navigation = useNavigation();
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setProvider(user.providerData[0].providerId);
        }
    }, [user]);

    const testProvider = () => {
        if (provider !== 'password' && title === 'Change Email') {
            Alert.alert('Error', 'You can only change your email when registered with email/password');
        }
        else if (provider !== 'password' && title === 'Change Password') {
            Alert.alert('Error', 'You can only change your password when registered with email/password');
        }
        else {
            navigation.navigate(page);
        }
    }

    return (
        <TouchableOpacity 
            className="flex-row items-center justify-between border-b border-slate-300 border-x-0 py-3 px-5"
            onPress={testProvider}
        >
            <Text>{title}</Text>
            <Ionicons name={icon} size={20} color="black"/>
        </TouchableOpacity>
    );
};

export default SettingsRow;