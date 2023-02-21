import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { Dropdown } from 'react-native-element-dropdown';
import { Slider } from "@miblanchard/react-native-slider";
import {useAuth} from '../../hooks/useAuth';
import { firestore } from '../../firebase';
import { doc, getDoc, updateDoc } from 'firebase/firestore';

const playStyleData = [
    { label: 'Casual', value: 'Casual' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Pro', value: 'Pro' },
];

const EditProfilePage = ({navigation}) => {
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState(0);
    const [afterRound, setAfterRound] = useState('');
    const [course, setCourse] = useState('');

    const { user } = useAuth();

    const updateUserInfo = async () => {
        try {
            await updateDoc(doc(firestore, 'users', user.uid), {
                playStyle: playStyle,
                handicap: handicap,
                afterRound, afterRound,
                course, course,
            });
            Alert.alert("Profile Updated", "Note: An app restart is required to see changes");
            navigation.goBack();
        } catch (error) {
            console.log("Error updating data:", error);
        }
    }

    //Trigger data fetch once user has loaded
    useEffect(() => {
        if (!user) {
            console.log('User loading');
        } else {
            const fetchData = async () => {
                const docRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setPlayStyle(data.playStyle);
                    setHandicap(data.handicap);
                    setAfterRound(data.afterRound);
                    setCourse(data.course);
                }
            }
            fetchData();
        }
    }, [user]);

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Edit Profile"}/>
            <View className="border-b border-slate-300 pb-5 mx-4">
                <Text className="font-semibold text-lg mt-3">Play Style</Text>
                <Dropdown 
                    data={playStyleData} 
                    value={playStyle}
                    onChange={item => {
                        setPlayStyle(item.value);
                    }}
                    labelField="label"
                    valueField="value"
                    placeholder={playStyle}
                    className="bg-white px-4 py-2 mt-1 w-1/2"
                />
            </View>
            
            {handicap < 25 ? <Text className="font-semibold text-lg mx-4 mt-5">Handicap: {handicap}</Text> 
            : <Text className="font-semibold text-lg mx-4 mt-4">Handicap: {handicap}+</Text> } 
            <View className="mt-3 border-b border-slate-300 pb-4 mx-4">
                <Slider 
                    value={handicap}
                    onValueChange={value => setHandicap(value)}
                    minimumValue={0}
                    maximumValue={25}
                    step={1}
                />
            </View>
            <Text className="font-semibold text-lg mx-4 mt-5">What are you doing after a round?</Text>
            <View className="border-b border-slate-300 pb-5 mx-4">
                <TextInput 
                    className="bg-white w-5/6 rounded-lg p-2 my-2"
                    onChangeText={text => setAfterRound(text)}
                    value={afterRound}
                />
            </View>
            <Text className="font-semibold text-lg mx-4 mt-5">Favourite/Home course?</Text>
            <View className="border-b border-slate-300 pb-5 mx-4">
                <TextInput 
                    className="bg-white w-5/6 rounded-lg p-2 my-2"
                    onChangeText={text => setCourse(text)}
                    value={course}
                />
            </View>
            <View className="flex-1 justify-center items-center">
                <TouchableOpacity 
                    className="w-5/6 py-3 px-3 bg-lime-600 rounded-lg"
                    onPress={updateUserInfo}
                >
                    <Text className="self-center text-white font-bold text-base">Apply</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default EditProfilePage;