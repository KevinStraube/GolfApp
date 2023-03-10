import React, { useState } from "react";
import { StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, Alert } from "react-native";
import MaskInput, { Masks } from "react-native-mask-input";
import { Dropdown } from "react-native-element-dropdown";
import { setDoc, collection, getFirestore, serverTimestamp, doc } from 'firebase/firestore';
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useAuth } from "../../hooks/useAuth";

const firestore = getFirestore();

async function addNewUser(uid, first, last, birthday, userGender, age) {
    await setDoc(doc(firestore, 'users', uid), {
        uid: uid,
        firstName: first,
        lastName: last,
        birthday: birthday,
        gender: userGender,
        age: age,
        timestamp: serverTimestamp(),
    });
}

const calculate_age = (birthday) => {
    var today = new Date();
    var dob = new Date(birthday);
    var age_now = today.getFullYear() - dob.getFullYear();
    var month = today.getMonth() - dob.getMonth();
    if (month < 0 || (month === 0 && today.getDate() < dob.getDate())) {
        age_now--;
    }
    return age_now;
}

const genderData = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Other', value: 'Other' },
];

const BasicInfoPage = ({navigation}) => {
    const { user } = useAuth();
    const [firstName, setFirstName] = useState('');
    const [lastName, setLastName] = useState('');
    const [date, setDate] = useState('');
    const [gender, setGender] = useState('');

    const validate = () => {
        return firstName.length > 0 & lastName.length > 0 & date.length === 10 & gender.length > 0;
    };

    const handleNext = () => {
        let age = calculate_age(date);
        if (age < 18) {
            Alert.alert("You must be at least 18 years old to use Clubhouse Golf");
        } else {
            addNewUser(user.uid, firstName, lastName, date, gender, age);
            navigation.navigate('PreferencesOnboarding');
        }
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView className="flex-1">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1">
                        <View className="border-b border-slate-300 pb-3">
                            <Text className="self-center font-semibold text-2xl mt-4">About You</Text>
                        </View>
                        <View className="border-b border-slate-300 pb-3">
                            <Text className="mt-4 mx-5">First Name</Text>
                            <TextInput 
                                className="bg-white w-4/5 rounded-lg p-3 mx-5 my-2"
                                onChangeText={text => setFirstName(text)}
                            />
                        </View>
                        <View className="border-b border-slate-300 pb-3">
                            <Text className="mt-4 mx-5">Last Name</Text>
                            <TextInput 
                                className="bg-white w-4/5 rounded-lg p-3 mx-5 my-2" 
                                onChangeText={text => setLastName(text)}
                            />
                        </View>
                        <View className="border-b border-slate-300 pb-3">
                            <Text className="mt-4 mx-5">Date of Birth (mm/dd/yyyy)</Text>
                            <MaskInput
                                value={date}
                                onChangeText={setDate}
                                mask={Masks.DATE_MMDDYYYY}
                                keyboardType="numeric"
                                className="text-lg p-2 mx-3"
                            />
                        </View>
                        <View className="border-b border-slate-300 pb-5">
                            <Text className="mt-4 mx-5">Gender</Text>
                            <Dropdown
                                data={genderData}
                                value={gender}
                                onChange={item => {
                                    setGender(item.value);
                                }}
                                labelField="label"
                                valueField="value"
                                placeholder="Select gender"
                                className="bg-white mx-5 w-1/3"
                            />
                        </View>
                        <TouchableOpacity 
                            className="mt-5 self-end mx-5 rounded-lg bg-green-700 p-3 w-1/5"
                            disabled={!validate()}
                            onPress={handleNext}
                            style={!firstName || !lastName || date.length < 10 || !gender ? styles.disabled : styles.enabled}
                            >
                            <Text className="text-white font-semibold self-center">Next</Text>
                        </TouchableOpacity>
                        <View className="flex-1 items-center justify-end my-4 mx-5">
                            <Text className="text-slate-600">Please ensure your details are correct. This information cannot be changed later.</Text>
                        </View>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
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