import { View, Text, SafeAreaView, FlatList, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header';
import { useAuth } from '../../hooks/useAuth';
import { AntDesign, MaterialCommunityIcons, Ionicons, MaterialIcons } from '@expo/vector-icons';

const MatchProfilePage = ({ navigation }) => {
    const {params} = useRoute();
    const {matchDetails} = params;
    const [profile, setProfile] = useState(null);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            if (matchDetails.usersMatched[0] === user.uid) {
                const matchedUserID = matchDetails.usersMatched[1];
                setProfile(matchDetails.users[matchedUserID]);
            } else {
                const matchedUserID = matchDetails.usersMatched[0];
                setProfile(matchDetails.users[matchedUserID]);
            }
        }
    }, [user]);

    return (
        <SafeAreaView className="flex-1">
            <Header title={profile?.firstName}/>

            <View className="flex justify-center items-center mt-3 self-center rounded-lg" style={{width: 350, height: 260}}>
                <FlatList 
                    data={profile?.images} 
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
                        <Text className="text-base mx-4">{profile?.age}</Text>
                    </View>

                    <View className="border-r border-slate-300 h-full">
                        <Text></Text>
                    </View>

                    <View className="flex-row items-center ml-4">
                        <AntDesign name='user' size={24} color="black" />
                        <Text className="text-base mx-4">{profile?.gender}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-evenly mx-4 py-3 border-b border-slate-300">
                    <View className="flex-row items-center">
                        <MaterialIcons name='sports-golf' size={24} color="black" />
                        <Text className="text-base mx-4">{profile?.playStyle}</Text>
                    </View>

                    <View className="border-r border-slate-300 h-full">
                        <Text></Text>
                    </View>

                    <View className="flex-row items-center ml-4">
                        <Text className="font-bold">HCP: </Text>
                        <Text className="text-base mx-4">{profile?.handicap}</Text>
                    </View>
                </View>

                <View className="flex-row items-center justify-center mx-4 py-3 border-b border-slate-300">
                    <Ionicons name='location-outline' size={24} color="black" />
                    <Text className="text-base mx-4">{profile?.city}</Text>
                </View>

                { 
                    profile?.course &&
                    <View className="flex-row items-center justify-center px-3 py-3 border-b border-slate-300 mx-4">
                        <Ionicons name='golf-outline' size={24} color="black" />
                        <Text className="text-base mx-4">{profile?.course}</Text>
                    </View>
                }

                <View className="py-3 mx-4">
                    <Text className="font-bold">What are you doing after a round?</Text>
                    <Text className="mt-2">{profile?.afterRound}</Text>
                </View>
            </View>
        </SafeAreaView>
    );
};

export default MatchProfilePage;