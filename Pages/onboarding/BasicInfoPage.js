import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { Dropdown } from "react-native-element-dropdown";

const genderData = [
    { label: 'Male', value: 'male' },
    { label: 'Female', value: 'female' },
    { label: 'Other', value: 'other' },
];

const BasicInfoPage = ({navigation}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState('');

    const validate = () => {
        return firstName.length > 0 & lastName.length > 0 & date.length === 10 & gender.length > 0;
    };

    return (
        <SafeAreaView className="flex-1">
            <Text className="self-center font-semibold text-2xl mt-4">Basic Info</Text>
            <Text className="mt-10 mx-5">First Name</Text>
            <TextInput 
                className="bg-white w-80 rounded-lg p-2 mx-5 my-2"
                onChangeText={text => setFirstName(text)}
            />
            <Text className="mt-8 mx-5">Last Name</Text>
            <TextInput 
                className="bg-white w-80 rounded-lg p-2 mx-5 my-2" 
                onChangeText={text => setLastName(text)}
            />
            <Text className="mt-8 mx-5">Date of Birth (mm/dd/yyyy)</Text>
            <MaskInput
                value={date}
                onChangeText={setDate}
                mask={Masks.DATE_MMDDYYYY}
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
                className="mt-8 self-end mx-5 rounded-lg bg-slate-400 p-3 w-20"
                disabled={!validate()}
                onPress={() => navigation.navigate('Notifications')}
                style={!firstName || !lastName || date.length < 10 || !gender ? styles.disabled : styles.enabled}
                >
                <Text className="self-center">Next</Text>
            </TouchableOpacity>
        </SafeAreaView>
    ); 
};

const styles = StyleSheet.create({
    enabled: {
        opacity: 1,
    },
    disabled: {
        opacity: 0.3,
    },
});

export default BasicInfoPage;