import React, { useEffect, useRef, useState } from "react";
import { View, Text, SafeAreaView, Button, Image, FlatList, TouchableOpacity } from "react-native";
import { doc, getDoc, onSnapshot } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";
import LoadingPage from './LoadingPage';
import { firestore } from "../../firebase";
import { AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons, Entypo } from '@expo/vector-icons';

const ProfilePage = ({navigation}) => {
    const [userData, setUserData] = useState(null);
    const [imageData, setImageData] = useState([]);

    const { user } = useAuth();
    
    //Wait until user loads to populate data
    useEffect(() => {
        if (user) {
            let unsubscribe;

            const loadData = async () => {
                unsubscribe = onSnapshot(doc(firestore, 'users', user.uid), (doc) => {
                    setUserData(doc.data());
                    setImageData(doc.data().images);
                })
            }
            loadData();

            return unsubscribe;
        } 
    }, [user]);

    /* POTENTIALLY ADD PAGINATOR TO FLATLIST */

    return !user || !userData ? <LoadingPage /> 
        : (
        <SafeAreaView className="flex-1">
            <View className="flex-row items-center mt-4 justify-between mr-5">
                <Text className="text-2xl font-semibold mx-5">{userData.firstName}</Text>
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
                        <Text className="text-base mx-4">{userData.age}</Text>
                    </View>

                    <View className="border-r border-slate-300 h-full">
                        <Text></Text>
                    </View>

                    <View className="flex-row items-center ml-4">
                        <AntDesign name='user' size={24} color="black" />
                        <Text className="text-base mx-4">{userData.gender}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-evenly mx-4 py-3 border-b border-slate-300">
                    <View className="flex-row items-center">
                        <MaterialIcons name='sports-golf' size={24} color="black" />
                        <Text className="text-base mx-4">{userData.playStyle}</Text>
                    </View>

                    <View className="border-r border-slate-300 h-full">
                        <Text></Text>
                    </View>

                    <View className="flex-row items-center ml-4">
                        <Text className="font-bold">HCP: </Text>
                        <Text className="text-base mx-4">{userData.handicap}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-center mx-4 py-3 border-b border-slate-300">
                    <Ionicons name='location-outline' size={24} color="black" />
                    <Text className="text-base mx-4">{userData.city}</Text>
                </View>

                { 
                    userData.course &&
                    <View className="flex-row items-center justify-center px-3 py-3 border-b border-slate-300 mx-4">
                        <Ionicons name='golf-outline' size={24} color="black" />
                        <Text className="text-base mx-4">{userData.course}</Text>
                    </View>
                }

                <View className="py-3 mx-4">
                    <Text className="font-bold">What are you doing after a round?</Text>
                    <Text className="mt-2">{userData.afterRound}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default ProfilePage;