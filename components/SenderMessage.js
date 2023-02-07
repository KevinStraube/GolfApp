import { View, Text, Image } from 'react-native'
import React from 'react'

const SenderMessage = ({ message }) => {
    return (
        <View
            className="bg-lime-600 rounded-lg rounded-tr-none px-4 py-3 mx-3 my-2"
            style={{alignSelf: "flex-start", marginLeft: "auto"}}
        >
            <Text className="text-white">
                {message.message}
            </Text>
        </View>
    );
};

export default SenderMessage;