import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image, Button } from "react-native";
import useIsMount from "../hooks/useIsMount";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "./LoadingPage";
import { async } from "@firebase/util";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";

const ChatPage = ({navigation}) => {

    const goToModal = () => {
        navigation.navigate('Match');
    }

    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <Button title="Go Modal" onPress={goToModal}/>
        </SafeAreaView>
    );
};

export default ChatPage;