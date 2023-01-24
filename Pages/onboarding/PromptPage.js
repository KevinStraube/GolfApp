import React, { useState } from "react";
import { Platform, SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { Dropdown } from "react-native-element-dropdown";

const playStyleData = [
    { label: 'Casual', value: 'casual' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Pro', value: 'pro' },
];

const PromptPage = ({navigation}) => {
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState('');
    const [afterRound, setAfterRound] = useState('');

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
            <Text className="mt-10 mx-5">Handicap (0-25+)</Text>
            <TextInput 
                className="bg-white w-80 rounded-lg p-2 mx-5 my-2" 
                keyboardType="numeric"
            />
            <Text className="mt-8 mx-5">What are you doing after a round?</Text>
            <TextInput 
                className="bg-white w-80 rounded-lg p-2 mx-5 my-2" 
            />

            <TouchableOpacity 
            className="mt-10 mx-5 rounded-lg bg-slate-400 p-3 w-20"
            >
                <Text className="self-center">Submit</Text>
            </TouchableOpacity>
        </SafeAreaView>
    ); 
};

export default PromptPage;