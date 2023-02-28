import React, { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, Button, Image, FlatList, TouchableOpacity } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getDoc } from "firebase/firestore";
import { useAuth } from "../hooks/useAuth";
import { getAuth, signOut } from "firebase/auth";
import LoadingPage from './LoadingPage';
import { firestore, messaging } from "../firebase";
import { AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';
import { getToken } from "firebase/messaging";
import { sendPushNotification } from "../backend/NotificationFunctions";

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

const ProfilePage = ({navigation}) => {
    const [name, setName] = useState('');
    const [age, setAge] = useState(0);
    const [gender, setGender] = useState('');
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState(0);
    const [afterRound, setAfterRound] = useState('');
    const [location, setLocation] = useState('');
    const [course, setCourse] = useState(null);
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
        if (data.course) {
            setCourse(data.course);
        }
    }
    
    useEffect(() => {
        if (!user) {
            console.log("User is not loaded yet");
        } else {
            loadData();
        }
    }, [user]);

    /* POTENTIALLY ADD PAGINATOR TO FLATLIST */

    return !user ? <LoadingPage /> 
        : (
        <SafeAreaView className="flex-1">
            <View className="flex-row items-center mt-4 justify-between mr-5">
                <Text className="text-2xl font-semibold mx-5">{name}</Text>
                <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                    <Ionicons name="menu" size={32} color="black"/>
                </TouchableOpacity>
            </View>
            <View className="flex justify-center items-center mt-3 self-center rounded-lg" style={{width: 350, height: 260}}>
                <FlatList 
                    data={imageData} 
                    renderItem={(item) => {
                        return (
                            <Image 
                                className="rounded-lg" 
                                source={{uri: item.item.url}}
                                style={{width:350, height:260}}
                            />
                        )
                    }}
                    keyExtractor={item => item.id}
                    horizontal
                    pagingEnabled
                    showsHorizontalScrollIndicator={false}
                />
            </View>
            <View className="flex rounded-lg mt-3 bg-white self-center" style={{width: '90%'}}>
                <View className="flex-row items-center justify-evenly mx-4 py-3 border-b border-slate-300">
                    <View className="flex-row items-center">
                        <MaterialCommunityIcons name='cake-variant-outline' size={24} color="black" />
                        <Text className="text-base mx-4">{age}</Text>
                    </View>

                    <View className="border-r border-slate-300 h-full">
                        <Text></Text>
                    </View>

                    <View className="flex-row items-center ml-4">
                        <AntDesign name='user' size={24} color="black" />
                        <Text className="text-base mx-4">{gender}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-evenly mx-4 py-3 border-b border-slate-300">
                    <View className="flex-row items-center">
                        <MaterialIcons name='sports-golf' size={24} color="black" />
                        <Text className="text-base mx-4">{playStyle}</Text>
                    </View>

                    <View className="border-r border-slate-300 h-full">
                        <Text></Text>
                    </View>

                    <View className="flex-row items-center ml-4">
                        <Text className="font-bold">HCP: </Text>
                        <Text className="text-base mx-4">{handicap}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-center mx-4 py-3 border-b border-slate-300">
                    <Ionicons name='location-outline' size={24} color="black" />
                    <Text className="text-base mx-4">{location}</Text>
                </View>

                { 
                    course &&
                    <View className="flex-row items-center justify-center px-3 py-3 border-b border-slate-300 mx-4">
                        <Ionicons name='golf-outline' size={24} color="black" />
                        <Text className="text-base mx-4">{course}</Text>
                    </View>
                }

                <View className="py-3 mx-4">
                    <Text className="font-bold">What are you doing after a round?</Text>
                    <Text className="mt-2">{afterRound}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProfilePage;