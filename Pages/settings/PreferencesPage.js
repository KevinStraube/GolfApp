import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header';
import { Slider } from "@miblanchard/react-native-slider";
import { Dropdown } from 'react-native-element-dropdown';

/* Maybe change dropdown to check boxes */
const genderData = [
    { label: 'Male', value: 'Male' },
    { label: 'Female', value: 'Female' },
    { label: 'Both', value: 'Both' },
]

const PreferencesPage = () => {
    const [age, setAge] = useState([18, 50]);
    const [gender, setGender] = useState('');
    const [handicapRange, setHandicapRange] = useState([0, 25]);
    //Change this to distance from database
    const [distance, setDistance] = useState(1);

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Golf Preferences"}/>
            <Text className="font-semibold text-lg mx-4 mt-3">Gender</Text>
            <Dropdown 
                data={genderData} 
                value={gender}
                onChange={item => {
                    setGender(item.value);
                }}
                labelField="label"
                valueField="value"
                className="bg-white px-4 py-2 mx-4 mt-1 w-1/2"
            />

            { age[1] < 50 ? <Text className="font-semibold text-lg mx-4 mt-7">Age: {age[0]} - {age[1]}</Text>
              : <Text className="font-semibold text-lg mx-4 mt-7">Age: {age[0]} - {age[1]}+</Text>
            }
            <View className="mx-4">
                <Slider
                    value={age}
                    onValueChange={value => setAge(value)}
                    minimumValue={18}
                    maximumValue={50}
                    step={1}
                />
            </View>

            { handicapRange[1] < 25 ? <Text className="font-semibold text-lg mx-4 mt-7">Handicap: {handicapRange[0]} - {handicapRange[1]}</Text>
              : <Text className="font-semibold text-lg mx-4 mt-7">Handicap: {handicapRange[0]} - {handicapRange[1]}+</Text>
            }
            <View className="mx-4">
                <Slider
                    value={handicapRange}
                    onValueChange={value => setHandicapRange(value)}
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
            <View className="flex-1 justify-center items-center">
                <TouchableOpacity className="w-5/6 py-3 px-3 bg-lime-600 rounded-lg">
                    <Text className="self-center text-white font-bold text-base">Apply</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default PreferencesPage;