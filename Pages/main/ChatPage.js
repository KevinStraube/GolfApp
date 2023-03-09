import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, Button, TouchableOpacity } from "react-native";
import LoadingPage from "./LoadingPage";
import Header from "../../components/Header";
import ChatList from "../../components/ChatList";

const ChatPage = () => {
    return (
        <SafeAreaView>
            <View className="items-center mt-1 border-b border-slate-300 pb-3">
                <Text className="text-2xl font-bold pl-2">Matches</Text>
            </View>
            <ChatList />
        </SafeAreaView>
    );
};

export default ChatPage;