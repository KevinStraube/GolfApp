import { View, Text, SafeAreaView, TextInput, Button, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../components/Header';
import getMatchedUserInfo from '../lib/getMatchedUserInfo';
import { useAuth } from '../hooks/useAuth';
import { useRoute } from '@react-navigation/native';
import SenderMessage from '../components/SenderMessage';
import ReceiverMessage from '../components/ReceiverMessage';
import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import { firestore } from '../firebase';

const MessagePage = () => {
    const { user } = useAuth();
    const { params } = useRoute();
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);

    const { matchDetails } = params;

    useEffect(() =>
        onSnapshot(
            query(
                collection(firestore, 'matches', matchDetails.id, 'messages'), 
                orderBy('timestamp', 'desc')
            ), (snapshot) => 
                setMessages(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                    })
                )
            )
        )
    , [matchDetails, firestore]);

    const sendMessage = () => {
        addDoc(collection(firestore, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: matchDetails.users[user.uid].firstName,
            photoURL: matchDetails.users[user.uid].images[0].url,
            message: input,
        })

        setInput("");
    };

    return (
        <SafeAreaView className="flex-1">
            <Header title={getMatchedUserInfo(matchDetails.users, user?.uid).firstName}/>

            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <FlatList
                        data={messages}
                        inverted={-1}
                        className="pl-4"
                        keyExtractor={item => item.id}
                        renderItem={({ item: message }) => 
                            message.userId === user.uid ? (
                                <SenderMessage key={message.id} message={message} />
                            ) : (
                                <ReceiverMessage key={message.id} message={message} />
                            )
                        }
                    />
                </TouchableWithoutFeedback>

                <View
                    className="flex-row justify-between items-center border-t border-gray-200 px-5 py-2"
                >
                    <TextInput
                        className="h-10 text-base"
                        placeholder='Send Message...'
                        onChangeText={setInput}
                        onSubmitEditing={sendMessage}
                        value={input}
                    />
                    <Button title="Send" color="#71C547" onPress={sendMessage}/>
                </View>
            </KeyboardAvoidingView>

        </SafeAreaView>
    );
};

export default MessagePage;