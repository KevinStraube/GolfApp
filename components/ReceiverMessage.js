import { View, Text, Image } from 'react-native'
import React from 'react'

const ReceiverMessage = ({ message }) => {
    return (
        <View
            className="bg-slate-400 rounded-lg rounded-tl-none px-4 py-3 mx-3 my-2 ml-6"
            style={{alignSelf: "flex-start"}}
        >
            <Image
                className="h-6 w-6 rounded-full absolute bottom-0 -left-8"
                source={{uri: message.photoURL}}
            />

            <Text className="text-white">
                {message.message}
            </Text>
        </View>
    );
};

export default ReceiverMessage;