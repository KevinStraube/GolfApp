import { View, Text, SafeAreaView, TouchableOpacity, Alert, StyleSheet } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { Slider } from "@miblanchard/react-native-slider";
import BouncyCheckBox from 'react-native-bouncy-checkbox';
import { useAuth } from '../../hooks/useAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { firestore } from '../../firebase';

const PreferencesPage = ({navigation}) => {
    const [maleCheckBox, setMaleCheckBox] = useState(true);
    const [femaleCheckBox, setFemaleCheckBox] = useState(true);
    const [otherCheckBox, setOtherCheckBox] = useState(true);
    const [age, setAge] = useState([]);
    const [handicapRange, setHandicapRange] = useState([]);
    const [distance, setDistance] = useState(1);

    const { user } = useAuth();

    //Wait for user data to load
    useEffect(() => {
        if (!user) {
            console.log("User loading...");
        } else {
            //Once user data has loaded, fetch user data
            const fetchData = async () => {
                const docRef = doc(firestore, 'users', user.uid);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    const data = docSnap.data();
                    setAge(data.ageRange);
                    setHandicapRange(data.handicapRange);
                    setDistance(data.distancePreference);
                }
            }
            fetchData();
        }
    }, [user]);

    //Update preferences once user presses confirm
    const handleNext = () => {
        //Add selected genders to array
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

        //Update the user's preferences in the database
        try {
            updateDoc(doc(firestore, 'users', user.uid),{
                genderPreference: genders,
                ageRange: age,
                handicapRange: handicapRange,
                distancePreference: distance,
            });
            Alert.alert("Preferences updated", "Note: An app restart is required to see changes");
            navigation.goBack();
        } catch (error) {
            console.log("Error updating document from preferences settings:", error);
        }
    }

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Golf Preferences"}/>
            <Text className="font-semibold text-lg mx-4 mt-3">Genders</Text>
            <View className="flex-row justify-evenly mt-4 border-b border-slate-300 pb-5 mx-4">
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

            { age[1] < 50 ? <Text className="font-semibold text-lg mx-4 mt-5">Age: {age[0]} - {age[1]}</Text>
              : <Text className="font-semibold text-lg mx-4 mt-5">Age: {age[0]} - {age[1]}+</Text>
            }
            <View className="mx-4 border-b border-slate-300 pb-5 mx-4">
                <Slider
                    value={age}
                    onValueChange={value => setAge(value)}
                    minimumValue={18}
                    maximumValue={50}
                    step={1}
                />
            </View>

            { handicapRange[1] < 25 ? <Text className="font-semibold text-lg mx-4 mt-5">Handicap: {handicapRange[0]} - {handicapRange[1]}</Text>
              : <Text className="font-semibold text-lg mx-4 mt-5">Handicap: {handicapRange[0]} - {handicapRange[1]}+</Text>
            }
            <View className="mx-4 border-b border-slate-300 pb-5 mx-4">
                <Slider
                    value={handicapRange}
                    onValueChange={value => setHandicapRange(value)}
                    minimumValue={0}
                    maximumValue={25}
                    step={1}
                />
            </View>

            <Text className="font-semibold text-lg mx-4 mt-5">Distance: {distance} km</Text>
            <View className="mx-4 border-b border-slate-300 pb-5 mx-4">
                <Slider
                    value={distance}
                    onValueChange={value => setDistance(value)}
                    minimumValue={1}
                    maximumValue={100}
                    step={1}
                />
            </View>
            <View className="flex-1 justify-center items-center">
                <TouchableOpacity 
                    className="w-5/6 py-3 px-3 bg-lime-600 rounded-lg"
                    disabled={!maleCheckBox && !femaleCheckBox && !otherCheckBox}
                    style={!maleCheckBox && !femaleCheckBox && !otherCheckBox ? styles.disabled : styles.enabled}
                    onPress={handleNext}
                >
                    <Text className="self-center text-white font-bold text-base">Apply</Text>
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