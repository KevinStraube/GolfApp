import { View, Text, SafeAreaView, TextInput } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header';
import { Dropdown } from 'react-native-element-dropdown';
import { Slider } from "@miblanchard/react-native-slider";

const playStyleData = [
    { label: 'Casual', value: 'Casual' },
    { label: 'Intermediate', value: 'Intermediate' },
    { label: 'Pro', value: 'Pro' },
];

const EditProfilePage = () => {
    const [playStyle, setPlayStyle] = useState('');
    const [handicap, setHandicap] = useState(0);
    const [afterRound, setAfterRound] = useState('');
    const [course, setCourse] = useState('');

    return (
        <SafeAreaView>
            <Header title={"Edit Profile"}/>
            <View>
                <Text className="font-semibold text-lg mx-4 mt-3">Play Style</Text>
                <Dropdown 
                    data={playStyleData} 
                    value={playStyle}
                    onChange={item => {
                        setPlayStyle(item.value);
                    }}
                    labelField="label"
                    valueField="value"
                    className="bg-white px-4 py-2 mx-4 mt-1 w-1/2"
                />

                {handicap < 25 ? <Text className="font-semibold text-lg mx-4 mt-7">Handicap: {handicap}</Text> 
                : <Text className="font-semibold text-lg mx-4 mt-7">Handicap: {handicap}+</Text> } 
                <View className="px-5 mt-3">
                    <Slider 
                        value={handicap}
                        onValueChange={value => setHandicap(value)}
                        minimumValue={0}
                        maximumValue={25}
                        step={1}
                    />
                </View>
                <Text className="font-semibold text-lg mx-4 mt-7">What are you doing after a round?</Text>
                <TextInput 
                    className="bg-white w-5/6 rounded-lg p-2 mx-5 my-2"
                    onChangeText={text => setAfterRound(text)}
                    value={afterRound}
                />
                <Text className="font-semibold text-lg mx-4 mt-7">Favourite/Home course?</Text>
                <TextInput 
                    className="bg-white w-5/6 rounded-lg p-2 mx-5 my-2"
                    onChangeText={text => setCourse(text)}
                    value={course}
                />
            </View>
        </SafeAreaView>
    );
};

export default EditProfilePage;