import React, { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, Button, Image, FlatList } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { getAuth, signOut } from "firebase/auth";
import LoadingPage from './LoadingPage';
import useIsMount from "../hooks/useIsMount";
import { firestore } from "../firebase";

async function getData(uid) {
    try {
        const docRef = doc(firestore, 'users', uid);
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
            const data = docSnap.data();
            console.log('Successfully retrieved data');
            return data;
        }
    } catch (e) {
        console.log('Error getting doc from database', e);
    }
}

const ProfilePage = ({ navigation }) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState('');
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState(0);
    const [afterRound, setAfterRound] = useState('');
    const [location, setLocation] = useState('');
    const [imageData, setImageData] = useState([]);

    const { user } = useAuth();

    const loadData = async () => {
        
        let data = await getData(user.uid);
        setName(data.firstName);
        setAge(data.age);
        setGender(data.gender);
        setPlayStyle(data.playStyle);
        setHandicap(data.handicap);
        setAfterRound(data.afterRound);
        setLocation(data.city);
        setImageData(data.images);
    }
    
    useEffect(() => {
        if (!user) {
            console.log("User is not loaded yet");
        } else {
            loadData();
        }
    }, [user]);

    const logout = () => {
        const auth = getAuth();
        signOut(auth).then(() => {
            console.log('Signed out successfully');
        }).catch((error) => {
            console.log("Error logging out:", error);
        });
    }

    /* POTENTIALLY ADD PAGINATOR TO FLATLIST */

    return !user ? <LoadingPage /> 
        : (
        <SafeAreaView className="flex-1">
            <Text className="text-2xl font-semibold mx-9 mt-4">{name}</Text>
            <View className="border-solid border-black border-none h-60 w-80 self-center mt-3">
                <FlatList 
                    data={imageData} 
                    renderItem={(item) => {
                        return (
                            <View className="w-80 justify-center items-center">
                                <Image className="w-80 h-60" source={{uri: item.item.url}} />
                            </View>
                        )
                    }}
                    keyExtractor={item => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View className="flex-row items-center justify-around mt-4">
                <Text>{age} years old</Text>
                <Text>{gender}</Text>
                <Text>{location}</Text>
            </View>
            <View className="mx-9 mt-16">
                <Text className="font-bold">Play Style</Text>
                <Text>{playStyle}</Text>
                <Text className="font-bold mt-6">Handicap</Text>
                <Text>{handicap}</Text>
                <Text className="font-bold mt-6">What are you doing after a round?</Text>
                <Text className="mb-24">{afterRound}</Text>
            </View>
            <Button title="logout" onPress={logout} />
        </SafeAreaView>
    );
};

export default ProfilePage;