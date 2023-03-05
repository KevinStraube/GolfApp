import { View, Text, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, FlatList, TextInput, Button } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import { firestore } from '../../firebase';
import { addDoc, collection, onSnapshot, serverTimestamp, query, orderBy } from 'firebase/firestore';
import SenderMessage from '../../components/SenderMessage';
import ReceiverMessage from '../../components/ReceiverMessage';
import { useAuth } from '../../hooks/useAuth';
import { sendPushNotification } from '../../backend/NotificationFunctions';
import getMatchedUserInfo from '../../lib/getMatchedUserInfo';

const MatchChatPage = () => {
    const {params} = useRoute();
    const {matchDetails} = params;
    const [input, setInput] = useState('');
    const [messages, setMessages] = useState([]);
    const [token, setToken] = useState(null);
    const [name, setName] = useState('');

    const { user } = useAuth();

    //Once the user is loaded, get user's notification token and first name
    useEffect(() => {
        if (user) {
            setToken(getMatchedUserInfo(matchDetails.users, user).notificationToken);
            setName(getMatchedUserInfo(matchDetails.users, user).firstName);
        }
    });

    //Once match details are loaded, query all messages between the two matched users
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
    ), [matchDetails, firestore]);
    
    //Once a user sends a message, add message to database
    const sendMessage = () => {
        addDoc(collection(firestore, 'matches', matchDetails.id, 'messages'), {
            timestamp: serverTimestamp(),
            userId: user.uid,
            displayName: matchDetails.users[user.uid].firstName,
            photoURL: matchDetails.users[user.uid].images[0].url,
            message: input,
            read: "false",
        });
        //Send the receiving user a push notification
        sendPushNotification(token, `${name}`, input);
        //Clear the message field
        setInput("");
    };

    return (
        <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
            keyboardVerticalOffset={135}
        >
            <View className="border-b border-slate-300"></View>
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
    );
};

export default MatchChatPage;