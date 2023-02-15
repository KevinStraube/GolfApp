import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import BouncyCheckBox from 'react-native-bouncy-checkbox';
import { Slider } from "@miblanchard/react-native-slider";
import { useAuth } from '../../hooks/useAuth';
import { doc, setDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';


const PreferencesPage = ({navigation}) => {
    const [maleCheckBox, setMaleCheckBox] = useState(false);
    const [femaleCheckBox, setFemaleCheckBox] = useState(false);
    const [otherCheckBox, setOtherCheckBox] = useState(false);
    const [age, setAge] = useState([18, 70]);
    const [handicap, setHandicap] = useState([0, 25]);
    const [distance, setDistance] = useState(50);

    const { user } = useAuth();

    const handleNext = () => {
        const genders = [];
        if (maleCheckBox) {
            genders.push('Male');
        }
        if (femaleCheckBox) {
            genders.push('Female');
        }
        if (otherCheckBox) {
            genders.push('Other');
        }

        try {
            setDoc(doc(firestore, 'users', user.uid, 'preferences', 'prefs'), 
            {
                genders: genders,
                ageRange: age,
                handicapRange: handicap,
                distance: distance,
            });
        } catch (error) {
            console.log("Error creating preferences:", error);
        }

        navigation.navigate('Notifications');
    }

    return (
        <SafeAreaView className="flex-1">
            <Text className="self-center font-semibold text-2xl mt-4">Golf Preferences</Text>

            <Text className="mt-10 mx-5 text-base font-bold">Genders you would like to play with</Text>
            <Text className="mt-1 mx-5">(Select all that apply)</Text>
            <View className="flex-row justify-evenly mt-6 border-b border-slate-300 pb-5 mx-4">
                <BouncyCheckBox 
                    size={20}
                    fillColor="green"
                    unfillColor="#FFFFFF"
                    text="Male"
                    iconStyle={{ borderColor: "green" }}
                    textStyle={{textDecorationLine: "none", color: "black"}}
                    onPress={() => setMaleCheckBox(!maleCheckBox)}
                    isChecked={maleCheckBox}
                />
                <BouncyCheckBox 
                    size={20}
                    fillColor="green"
                    unfillColor="#FFFFFF"
                    text="Female"
                    iconStyle={{ borderColor: "green" }}
                    textStyle={{textDecorationLine: "none", color: "black"}}
                    onPress={() => setFemaleCheckBox(!femaleCheckBox)}
                    isChecked={femaleCheckBox}
                />
                <BouncyCheckBox 
                    size={20}
                    fillColor="green"
                    unfillColor="#FFFFFF"
                    text="Other"
                    iconStyle={{ borderColor: "green" }}
                    textStyle={{textDecorationLine: "none", color: "black"}}
                    onPress={() => setOtherCheckBox(!otherCheckBox)}
                    isChecked={otherCheckBox}
                />
            </View>

            { age[1] < 70 ? <Text className="font-semibold text-lg mx-4 mt-5">Age Range: {age[0]} - {age[1]}</Text>
              : <Text className="font-semibold text-lg mx-4 mt-5">Age Range: {age[0]} - {age[1]}+</Text>
            }
            <View className="mx-4 border-b border-slate-300 pb-5">
                <Slider
                    value={age}
                    onValueChange={value => setAge(value)}
                    minimumValue={18}
                    maximumValue={70}
                    step={1}
                />
            </View>

            { handicap[1] < 25 ? <Text className="font-semibold text-lg mx-4 mt-5">Handicap Range: {handicap[0]} - {handicap[1]}</Text>
              : <Text className="font-semibold text-lg mx-4 mt-5">Handicap Range: {handicap[0]} - {handicap[1]}+</Text>
            }
            <View className="mx-4 border-b border-slate-300 pb-5">
                <Slider
                    value={handicap}
                    onValueChange={value => setHandicap(value)}
                    minimumValue={0}
                    maximumValue={25}
                    step={1}
                />
            </View>

            <Text className="font-semibold text-lg mx-4 mt-7">Distance: {distance} km</Text>
            <View className="mx-4">
                <Slider
                    value={distance}
                    onValueChange={value => setDistance(value)}
                    minimumValue={1}
                    maximumValue={100}
                    step={1}
                />
            </View>

            <TouchableOpacity 
                className="mt-8 self-end mx-5 rounded-lg bg-slate-400 p-3 w-20"
                disabled={maleCheckBox && femaleCheckBox && otherCheckBox}
                style={maleCheckBox && femaleCheckBox && otherCheckBox ? styles.disabled : styles.enabled}
                onPress={handleNext}
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


export default PreferencesPage;