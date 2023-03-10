import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import Header from '../../components/Header';

const HelpPage = () => {
    return (
        <SafeAreaView className="flex-1">
            <Header title={"Help Center"}/>
            <View className="flex-1 justify-center items-center">
                <Text className="font-bold text-xl">For any questions, comments or concerns please email clubhousegolf.help@gmail.com</Text>
            </View>
        </SafeAreaView>
    );
};

export default HelpPage;