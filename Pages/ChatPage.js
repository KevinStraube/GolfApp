import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image } from "react-native";
import useIsMount from "../hooks/useIsMount";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "./LoadingPage";
import { async } from "@firebase/util";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";

const ChatPage = () => {

    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <Text>Chat Page</Text>
        </SafeAreaView>
    );
};

export default ChatPage;