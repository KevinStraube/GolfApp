import { View, Text, TouchableOpacity, Image, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../hooks/useAuth';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { collection, doc, onSnapshot, orderBy, query, updateDoc } from 'firebase/firestore';
import { firestore } from '../firebase';
import { Entypo } from '@expo/vector-icons';

const ChatRow = ({ matchDetails }) => {
    const navigation = useNavigation();
    const { user } = useAuth();
    const [matchedUserInfo, setMatchedUserInfo] = useState(null);
    const [lastMessage, setLastMessage] = useState('');
    const [lastMessageId, setLastMessageId] = useState(null);

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
            ), (snapshot) => {
                setLastMessage(snapshot.docs[0]?.data());
                setLastMessageId(snapshot.docs[0]?.id);
            }
        )
    , [matchDetails, user]);

    useEffect(() => {
        console.log(lastMessage);
        console.log(lastMessageId);
    }, [lastMessage]);

    return (
        <TouchableOpacity 
            className="flex-row border-slate-400 border border-x-0 items-center py-3 bg-white px-5 my-1"
            onPress={() => {
                try {
                    updateDoc(doc(firestore, 'matches', matchDetails.id, 'messages', lastMessageId), {
                        read: "true",
                    })
                } catch (error) {
                    console.log("No messages yet");
                }
                navigation.navigate('Message', {
                    matchDetails,
                })
            }}
        >   
            <Image
                className="rounded-full h-14 w-14 mr-4"
                source={{ uri: matchedUserInfo?.images[0].url }}
            />
            
            <View>
                <Text className="text-base font-semibold">
                    {matchedUserInfo?.firstName}
                </Text>
                {
                    (lastMessage?.message && lastMessage.read === "false" && lastMessage?.userId !== user.uid) ?
                    <Text className="font-semibold">{lastMessage?.message}</Text>
                    :
                    <Text>{lastMessage?.message || "Say Hi!"}</Text>
                }
            </View>
            {
                (lastMessage?.read === "false" && lastMessage?.userId !== user.uid) && 
                <View className="ml-auto">
                    <Entypo name='dot-single' size={57} color="#5BE143" />
                </View>
            }
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