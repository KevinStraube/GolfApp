import React, { useState } from "react";
import { Platform, SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import DateTimePicker from '@react-native-community/datetimepicker';
import MaskInput, { Masks } from "react-native-mask-input";
import { Dropdown } from "react-native-element-dropdown";

const genderData = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
];

const BasicInfoPage = ({navigation}) => {
    const [date, setDate] = useState('');
    const [gender, setGender] = useState('');

    return (
        <SafeAreaView className="flex-1">
            <Text className="mt-10 mx-5">First Name</Text>
            <TextInput 
                className="bg-white w-80 rounded-lg p-2 mx-5 my-2" 
            />
            <Text className="mt-8 mx-5">Last Name</Text>
            <TextInput 
                className="bg-white w-80 rounded-lg p-2 mx-5 my-2" 
            />
            <Text className="mt-8 mx-5">Date of Birth (dd/mm/yyyy)</Text>
            <MaskInput
                value={date}
                onChangeText={setDate}
                mask={Masks.DATE_DDMMYYYY}
                keyboardType="numeric"
                className="text-lg p-2 mx-3"
            />
            <Text className="mt-8 mx-5">Gender</Text>
            <Dropdown
                data={genderData}
                value={gender}
                onChange={item => {
                    setGender(item.value);
                }}
                labelField="label"
                valueField="value"
                placeholder="Select gender"
                className="bg-white mx-5 w-32"
            />
            <TouchableOpacity 
                className="mt-8 mx-5 rounded-lg bg-slate-400 p-3 w-20"
                onPress={() => navigation.navigate('Notifications')}>
                <Text className="self-center">Next</Text>
            </TouchableOpacity>
            
        </SafeAreaView>
    ); 
};

export default BasicInfoPage;