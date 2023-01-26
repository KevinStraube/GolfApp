import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { Dropdown } from "react-native-element-dropdown";
import { addDoc, collection, getFirestore } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";

const firestore = getFirestore();

const userCollection = collection(firestore, 'users');

async function addNewUser(first, last, birthday, userGender, age) {
    const newDoc = await addDoc(userCollection, {
        firstName: first,
        lastName: last,
        birthday: birthday,
        gender: userGender,
        age: age,
    });
    console.log('New doc was created at: ', newDoc.path);

    try {
        await AsyncStorage.setItem('@userCollectionID', newDoc.id);
        console.log('New firebase user doc id added to async storage:', newDoc.id);
    } catch (e) {
        console.log('Error uploading firebase doc ID to async storage: ', e);
    }
}

const calculate_age = (birthday) => {
    var today = new Date();
    var dob = new Date(birthday);
    var age_now = today.getFullYear() - dob.getFullYear();
    var month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age_now--;
    }
    console.log(age_now);
    return age_now;
}

const genderData = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
];

const BasicInfoPage = ({navigation}) => {
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState('');

    const validate = () => {
        return firstName.length > 0 & lastName.length > 0 & date.length === 10 & gender.length > 0;
    };

    const handleNext = () => {
        let age = calculate_age(date);
        addNewUser(firstName, lastName, date, gender, age);
        navigation.navigate('Notifications');
    }

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
                onPress={handleNext}
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