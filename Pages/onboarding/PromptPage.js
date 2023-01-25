import React, { useState, useEffect } from "react";
import { StyleSheet, SafeAreaView, Text, TextInput, TouchableOpacity, View } from "react-native";
import { Dropdown } from "react-native-element-dropdown";
import { Slider } from "@miblanchard/react-native-slider";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { doc, getFirestore, updateDoc } from "firebase/firestore";
import TabNavigator from "../../navigation/TabNavigator";

const firestore = getFirestore();

async function uploadData(playStyle, handicap, afterRound) {
    try {
        //Pull user's document ID from async storage
        const docID = await AsyncStorage.getItem('@userCollectionID');
        if (docID !== null) {
            console.log('Fetched ID:', docID);
            try {
                //Fetch doc from database
                const userDoc = doc(firestore, "users", docID);
                await updateDoc(userDoc, {
                    playStyle: playStyle,
                    handicap: handicap[0],
                    afterRound: afterRound,
                });
                console.log("Uploaded personalized data to database");
            } catch (e) {
                console.log('Error uploading personalized data to database', e);
            }
        }
    } catch (error) {
        console.log('Error fetching @userCollectionID', error);
    }
}  

const playStyleData = [
    { label: 'Casual', value: 'casual' },
    { label: 'Intermediate', value: 'intermediate' },
    { label: 'Pro', value: 'pro' },
];

async function viewOnboarding() {
    try {
        await AsyncStorage.setItem('@viewedOnboarding', 'true');
        console.log("Stored @viewedonboarding");
    } catch (error) {
        console.log("Error storing @viewedOnboarding to AsyncStorage: ", error);
    }
}

const PromptPage = ({navigation}) => {
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState(0);
    const [afterRound, setAfterRound] = useState('');

    const handleSubmit = () => {
        viewOnboarding();
        uploadData(playStyle, handicap, afterRound);
        navigation.navigate('Home');
    }

    const validate = () => {
        return playStyle.length > 0 & afterRound.length > 0;
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
                    disabled={!validate()}
                    onPress={handleSubmit}
                    style={playStyle.length < 1 || afterRound.length < 1 ? styles.disabled : styles.enabled}
                >
                    <Text className="self-center">Submit</Text>
                </TouchableOpacity>
            </View>
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