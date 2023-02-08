import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { collection, onSnapshot, orderBy, query } from 'firebase/firestore';
import { firestore } from '../firebase';

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');

    useEffect(() => {
        if (user && matchDetails) {
            setMatchedUserInfo(getMatchedUserInfo(matchDetails.users, user.uid));
        } else {
            console.log('Loading user and match details');
        }
    }, [matchDetails, user]);

    useEffect(() => 
        onSnapshot(
            query(
                collection(firestore, 'matches', matchDetails.id, 'messages'),
                orderBy('timestamp', 'desc')
            ), (snapshot) => setLastMessage(snapshot.docs[0]?.data().message)
        )
    , [matchDetails, user]);

    return (
        <TouchableOpacity 
            className="flex-row border-slate-400 border border-x-0 items-center py-3 bg-white px-5 my-1"
            onPress={() => navigation.navigate('Message', {
                matchDetails,
            })}
        >   
            <Image
                className="rounded-full h-14 w-14 mr-4"
                source={{ uri: matchedUserInfo?.images[0].url }}
            />
            
            <View>
                <Text className="text-base font-semibold">
                    {matchedUserInfo?.firstName}
                </Text>
                <Text>{lastMessage || "Say Hi!"}</Text>
            </View>
        </TouchableOpacity>
    );
};

export default ChatRow;

const styles = StyleSheet.create({
    cardShadow: {
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 1,
        },
        shadowOpacity: 0.2,
        shadowRadius: 1.41,
        elevation: 2,
    },
});