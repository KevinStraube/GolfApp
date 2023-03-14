import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, View, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Slider } from "@miblanchard/react-native-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import { useAuth } from "../../hooks/useAuth";

const firestore = getFirestore();

async function uploadData(uid, playStyle, handicap, afterRound, course) {
    let realHandicap;
    if (!handicap) {
        realHandicap = 0;
    } else {
        realHandicap = handicap[0];
    }
    try {
        //Fetch doc from database
        const userDoc = doc(firestore, "users", uid);
        await updateDoc(userDoc, {
            playStyle: playStyle,
            handicap: realHandicap,
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
    const [course, setCourse] = useState('');
    const [characters, setCharacters] = useState(35);
    const { user } = useAuth();

    const handleSubmit = () => {
        viewOnboarding();
        uploadData(user.uid, playStyle, handicap, afterRound, course);
        navigation.navigate('Main');
    }

    const validate = () => {
        return playStyle.length > 0 && afterRound.length > 0 && characters >= 0;
    }

    return (
        <SafeAreaView className="flex-1">
            <KeyboardAvoidingView className="flex-1">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1">
                        <View className="border-b border-slate-300 pb-4">
                            <Text className="text-2xl font-semibold self-center mt-4">Personalize Your Profile</Text>
                        </View>
                        <Text className="text-base font-semibold mt-4 mx-5 mb-1">Play Style</Text>
                        <View className=" border-b border-slate-300 pb-5">
                            <Dropdown
                                data={playStyleData}
                                value={playStyle}
                                onChange={item => {
                                    setPlayStyle(item.value);
                                }}
                                labelField="label"
                                valueField="value"
                                placeholder="Select play style"
                                className="bg-white mx-5 w-2/5"
                            />
                        </View>
                        {handicap < 25?
                        <Text className="text-base font-semibold mt-4 mx-5">Handicap: {handicap}</Text>
                        :
                        <Text className="text-base font-semibold mt-4 mx-5">Handicap: {handicap}+</Text>
                        }  
                        <View className="px-5 mt-3 border-b border-slate-300 pb-3">
                            <Slider 
                                value={handicap}
                                onValueChange={value => setHandicap(value)}
                                minimumValue={0}
                                maximumValue={25}
                                step={1}
                            />
                        </View>
                        <View className="flex-row items-center mt-4">
                            <Text className="text-base font-semibold ml-5 mr-1">What are you doing after a round?</Text>
                            {
                                characters >= 0 ?
                                <Text className="text-base text-slate-500">({characters})</Text>
                                :
                                <Text className="text-base text-rose-500">({characters})</Text>
                            }
                        </View>
                        <View className="border-b border-slate-300 pb-4">
                            <TextInput 
                                className="bg-white w-4/5 rounded-lg p-3 mx-5 my-2"
                                onChangeText={(text) => {
                                    setAfterRound(text);
                                    let charsLeft = 35 - text.length;
                                    setCharacters(charsLeft);
                                }}
                                value={afterRound}
                            />
                        </View>
                        <View className="flex-row mt-4">
                            <Text className="text-base font-semibold ml-5">Favourite/Home course?</Text>
                            <Text className="text-xs self-center text-slate-500"> (optional)</Text>
                        </View>
                        <View className="border-b border-slate-300 pb-4">
                            <TextInput 
                                className="bg-white w-4/5 rounded-lg p-3 mx-5 my-2"
                                onChangeText={text => setCourse(text)}
                                value={course}
                            />
                        </View>
                        <View className="flex-row justify-between mx-5">
                            <TouchableOpacity 
                                className="mt-6 rounded-lg bg-green-700 p-3 w-20"
                                onPress={() => navigation.navigate('Images')}>
                                <Text className="text-white font-semibold self-center">Back</Text>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                className="mt-6 rounded-lg bg-green-700 p-3 w-20"
                                disabled={!validate()}
                                onPress={handleSubmit}
                                style={playStyle.length < 1 || afterRound.length < 1 || characters < 0 ? styles.disabled : styles.enabled}
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