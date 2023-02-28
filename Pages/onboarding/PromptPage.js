import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Slider } from "@miblanchard/react-native-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

const firestore = getFirestore();

async function uploadData(uid, playStyle, handicap, afterRound, course) {
    try {
        //Fetch doc from database
        const userDoc = doc(firestore, "users", uid);
        await updateDoc(userDoc, {
            playStyle: playStyle,
            handicap: handicap[0],
            afterRound: afterRound,
            course: course,
        });
        console.log("Uploaded personalized data to database");
    } catch (e) {
        console.log('Error uploading personalized data to database', e);
    }
}  

const playStyleData = [
    { label: 'Casual', value: 'Casual' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Pro', value: 'Pro' },
];

async function viewOnboarding() {
    try {
        await AsyncStorage.setItem('@viewedOnboarding', 'true');
        console.log("Stored @viewedOnboarding");
    } catch (error) {
        console.log("Error storing @viewedOnboarding to AsyncStorage: ", error);
    }
}

const PromptPage = ({navigation}) => {
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState(0);
    const [afterRound, setAfterRound] = useState('');
    const [onboarding, setOnboarding] = useState(false);
    const [course, setCourse] = useState('');
    const { user } = useAuth();

    const handleSubmit = () => {
        viewOnboarding();
        if (!handicap) {
            setHandicap(0);
        }
        uploadData(user.uid, playStyle, handicap, afterRound, course);
        setOnboarding(true);
        navigation.navigate('Main');
    }

    const validate = () => {
        return playStyle.length > 0 & afterRound.length > 0;
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView className="flex-1">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1">
                        <Text className="text-2xl font-semibold self-center mt-4">Personalize Your Profile</Text>
                        <Text className="text-base font-semibold mt-8 mx-5 mb-1">Play Style</Text>
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
                        {handicap < 25?
                        <Text className="text-base font-semibold mt-10 mx-5">Handicap: {handicap}</Text>
                        :
                        <Text className="text-base font-semibold mt-10 mx-5">Handicap: {handicap}+</Text>
                        }  
                        <View className="px-5 mt-3">
                            <Slider 
                                value={handicap}
                                onValueChange={value => setHandicap(value)}
                                minimumValue={0}
                                maximumValue={25}
                                step={1}
                            />
                        </View>
                        <Text className="text-base font-semibold mt-8 mx-5">What are you doing after a round?</Text>
                        <TextInput 
                            className="bg-white w-4/5 rounded-lg p-2 mx-5 my-2"
                            onChangeText={text => setAfterRound(text)}
                            value={afterRound}
                        />
                        <View className="flex-row mt-8">
                            <Text className="text-base font-semibold ml-5">Favourite/Home course?</Text>
                            <Text className="text-xs self-center text-slate-500"> (optional)</Text>
                        </View>
                        <TextInput 
                            className="bg-white w-4/5 rounded-lg p-2 mx-5 my-2"
                            onChangeText={text => setCourse(text)}
                            value={course}
                        />
                        <View className="flex-row justify-around">
                            <TouchableOpacity 
                                className="mt-10 rounded-lg bg-lime-500 p-3 w-20"
                                onPress={() => navigation.navigate('Images')}>
                                <Text className="text-white font-semibold self-center">Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className="mt-10 mx-5 rounded-lg bg-lime-500 p-3 w-20"
                                disabled={!validate()}
                                onPress={handleSubmit}
                                style={playStyle.length < 1 || afterRound.length < 1 ? styles.disabled : styles.enabled}
                            >
                                <Text className="text-white font-semibold self-center">Submit</Text>
                            </TouchableOpacity>
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


export default PromptPage;