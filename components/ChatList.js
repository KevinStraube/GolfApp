import { View, Text, FlatList } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuth } from '../hooks/useAuth';
import ChatRow from './ChatRow';

const ChatList = () => {
    const [matches, setMatches] = useState([]);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            onSnapshot(query(
                collection(firestore, 'matches'),
                where('usersMatched', 'array-contains', user.uid)
            ),
            (snapshot) => 
                setMatches(
                    snapshot.docs.map((doc) => ({
                        id: doc.id,
                        ...doc.data(),
                        })
                    )
                )
            );
        } else {
            console.log("User not loaded yet...");
        }
    }, [user]);

    console.log(matches);

    return (
        matches.length > 0 ? (
            <FlatList 
                className="h-full"
                data={matches}
                keyExtractor={item => item.id}
                renderItem={({item}) => <ChatRow matchDetails={item} />}
            />
        ) : (
            <View className="flex-1 justify-center items-center">
                <Text>No matches yet!</Text>
            </View>
        )
    );
};

export default ChatList;