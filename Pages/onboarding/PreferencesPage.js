import { View, Text, SafeAreaView, TextInput, TouchableOpacity, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import BouncyCheckBox from 'react-native-bouncy-checkbox';
import { Slider } from "@miblanchard/react-native-slider";
import { useAuth } from '../../hooks/useAuth';
import { doc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';


const PreferencesPage = ({navigation}) => {
    const [maleCheckBox, setMaleCheckBox] = useState(false);
    const [femaleCheckBox, setFemaleCheckBox] = useState(false);
    const [otherCheckBox, setOtherCheckBox] = useState(false);
    const [age, setAge] = useState([18, 50]);
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
            updateDoc(doc(firestore, 'users', user.uid), 
            {
                genderPreference: genders,
                ageRange: age,
                handicapRange: handicap,
                distancePreference: distance,
            });
        } catch (error) {
            console.log("Error creating preferences:", error);
        }

        navigation.navigate('Notifications');
    }

    return (
        <SafeAreaView className="flex-1">
            <View className="border-b border-slate-300 pb-3">
                <Text className="self-center font-semibold text-2xl mt-4">Golf Preferences</Text>
            </View>

            <Text className="mt-5 mx-5 text-base font-bold">Genders you would like to play with:</Text>
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

            { age[1] < 50 ? <Text className="font-semibold text-lg mx-4 mt-5">Age Range: {age[0]} - {age[1]}</Text>
              : <Text className="font-semibold text-lg mx-4 mt-5">Age Range: {age[0]} - {age[1]}+</Text>
            }
            <View className="mx-4 border-b border-slate-300 pb-5">
                <Slider
                    value={age}
                    onValueChange={value => setAge(value)}
                    minimumValue={18}
                    maximumValue={50}
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
            
            <Text className="font-semibold text-lg mx-4 mt-5">Distance: {distance} km</Text>
            <View className="mx-4 border-b border-slate-300 pb-5">
                <Slider
                    value={distance}
                    onValueChange={value => setDistance(value)}
                    minimumValue={1}
                    maximumValue={100}
                    step={1}
                />
            </View>

            <View className="flex-row justify-between items-center mt-6 mx-5">
                <TouchableOpacity 
                    className="rounded-lg bg-green-700 p-3 w-1/5"
                    onPress={() => navigation.goBack()}
                >
                    <Text className="text-white font-semibold self-center">Back</Text>
                </TouchableOpacity>

                <TouchableOpacity 
                    className="rounded-lg bg-green-700 p-3 w-1/5"
                    disabled={!maleCheckBox && !femaleCheckBox && !otherCheckBox}
                    style={!maleCheckBox && !femaleCheckBox && !otherCheckBox ? styles.disabled : styles.enabled}
                    onPress={handleNext}
                >
                    <Text className="text-white font-semibold self-center">Next</Text>
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


export default PreferencesPage;