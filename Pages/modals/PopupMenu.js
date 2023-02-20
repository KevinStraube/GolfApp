import { View, Text, TouchableOpacity, Modal, SafeAreaView, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { Feather } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import { collection, deleteDoc, doc, onSnapshot, query } from 'firebase/firestore';
import { firestore } from '../../firebase';

const PopupMenu = () => {
    const [visible, setVisible] = useState(false);
    const { params } = useRoute();

    const { matchDetails } = params;

    const navigation = useNavigation();

    //2 menu options
    const options = [
        {
            title: "View Profile",
            icon: "user",
            action: () => navigation.navigate('MatchProfile',{matchDetails: matchDetails}),
        },
        {
            title: "Un-match",
            icon: "trash-2",
            action: () => Alert.alert("Confirm", "Are you sure you want to remove the match?",[
                {
                    text: "Cancel",
                    style: "cancel",
                },
                {   /* TEST IF THIS FAILS WHEN NO MESSAGES HAVE BEEN SENT */
                    //Delete all messages, then delete match 
                    text: "Remove",
                    onPress: (async () => {
                        onSnapshot(
                            query(
                                collection(firestore, 'matches', matchDetails.id, 'messages'),
                            ),(snapshot) => 
                                snapshot.docs.forEach((snap) => (
                                    deleteDoc(snap.ref)
                                )
                            )
                        )
                        deleteDoc(doc(firestore, 'matches', matchDetails.id));
                        navigation.navigate('Main');
                    }),
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