import React, { useEffect, useState } from "react";
import { View, Text, SafeAreaView, Image } from "react-native";
import useIsMount from "../hooks/useIsMount";
import { useAuth } from "../hooks/useAuth";
import LoadingPage from "./LoadingPage";
import { async } from "@firebase/util";
import { doc, getDoc, getFirestore, onSnapshot } from "firebase/firestore";

const ChatPage = () => {

    const imageUrl = "https://firebasestorage.googleapis.com/v0/b/golfapp-ca492.appspot.com/o/30ADB400-814A-400B-A438-FEFCB97E97FC?alt=media&token=be9175fc-ecc1-4bf7-8a49-dc4e3b3d7200";

    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <View className="w-60 h-48 border-black border-2 border-solid">
                <Image className="w-full h-full" source={{uri: imageUrl}}/>
            </View>
        </SafeAreaView>
    );
};

export default ChatPage;