import { View, Text } from 'react-native'
import React, { useEffect, useState } from 'react'
import { collection, onSnapshot, where, query } from 'firebase/firestore';
import { firestore } from '../firebase';
import { useAuth } from '../hooks/useAuth';

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
        <View>
            <Text>ChatList</Text>
        </View>
    );
};

export default ChatList;