import React, { useState } from "react";
import { Platform, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Slider } from "@miblanchard/react-native-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";

const playStyleData = [
    { label: 'Casual', value: 'casual' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Pro', value: 'pro' },
];

const viewedOnboarding = async () => {
    try {
        await AsyncStorage.setItem('@viewedOnboarding', true);
    } catch (error) {
        console.log("Error storing @viewedOnboarding to AsyncStorage: ", error);
    }
}

const PromptPage = ({navigation}) => {
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState(0);
    const [afterRound, setAfterRound] = useState('');

    const handleSubmit = () => {
        viewedOnboarding();
    }

    return (
        <SafeAreaView className="flex-1">
            <Text className="text-2xl font-semibold self-center mt-4">Personalize Your Profile</Text>
            <Text className="mt-8 mx-5 mb-1">Play Style</Text>
            <Dropdown
                data={playStyleData}
                value={playStyle}
                onChange={item => {
                    setPlayStyle(item.value);
                }}
                labelField="label"
                valueField="value"
                placeholder="Select play style"
                className="bg-white mx-5 w-36"
            />
            <Text className="mt-10 mx-5">Handicap (0-25+): {handicap}</Text>
            <View className="px-5 mt-3">
                <Slider 
                    value={handicap}
                    onValueChange={value => setHandicap(value)}
                    minimumValue={0}
                    maximumValue={25}
                    step={1}
                />
            </View>
            <Text className="mt-8 mx-5">What are you doing after a round?</Text>
            <TextInput 
                className="bg-white w-80 rounded-lg p-2 mx-5 my-2"
                onChangeText={text => setAfterRound(text)}
                value={afterRound}
            />
            <View className="flex-row justify-around">
                <TouchableOpacity 
                    className="mt-10 rounded-lg bg-slate-400 p-3 w-20"
                    onPress={() => navigation.navigate('Images')}>
                    <Text className="self-center">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="mt-10 mx-5 rounded-lg bg-slate-400 p-3 w-20"
                    onPress={() => navigation.navigate('')}
                >
                    <Text className="self-center">Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    ); 
};

export default PromptPage;