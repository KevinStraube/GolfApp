import { View, Text, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native'
import React, { useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';

const PopupMenu = () => {
    const [visible, setVisible] = useState(false);
    const { params } = useRoute();

    const { matchDetails } = params;

    const navigation = useNavigation();

    const options = [
        {
            title: "View Profile",
            icon: "user",
            action: () => navigation.navigate('MatchProfile'),
        },
        {
            title: "Un-match",
            icon: "trash-2",
            action: () => Alert.alert("Confirm", "Are you sure you want to remove the match?",[
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {
                    text: "Remove",
                },
            ]),
        },
    ];

    return (
        <>
            <TouchableOpacity onPress={() => setVisible(true)}>
                <Feather name='more-horizontal' size={32} color="black" />
            </TouchableOpacity>
            <Modal transparent visible={visible}>
                <SafeAreaView 
                    className="flex-1" 
                    onTouchEnd={() => setVisible(false)}
                >
                    <View className="rounded-lg border border-slate-400 bg-white px-2 w-1/3 ml-auto mr-5 mt-10">
                        {options.map((option, i) => (
                            <TouchableOpacity 
                                className="flex-row items-center justify-between py-2 border-slate-300" 
                                key={ i } 
                                onPress={option.action}
                                style={{borderBottomWidth: i === options.length - 1 ? 0 : 1}}
                            >
                                <Text>{option.title}</Text>
                                <Feather name={option.icon} size={20} color="black"/>
                            </TouchableOpacity>
                        ))}
                    </View>
                </SafeAreaView>
            </Modal>
        </> 
    );
};

export default PopupMenu;