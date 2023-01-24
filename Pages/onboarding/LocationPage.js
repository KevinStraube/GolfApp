import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Location from 'expo-location';

async function registerForLocationAsync() {
    let location;

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        alert('Please enable location services to proceed.');
        return;
    }

    location = await Location.getCurrentPositionAsync({});
    return location;
}

const LocationPage = ({ navigation }) => {
    const [location, setLocation] = useState(false);

    const handleLocationEnable = () => {
        let loc = registerForLocationAsync();
        setLocation(loc);
        console.log(JSON.stringify(location));
        navigation.navigate('Images');
    }

    return (
        <SafeAreaView>
            <Text className="text-xl font-semibold mt-8 self-center">Where do you live?</Text>
            <TouchableOpacity 
                className="mt-10 self-center bg-slate-300 p-3 rounded-2xl"
                onPress={handleLocationEnable}
                >
                <Text>Enable Location</Text>
            </TouchableOpacity>
            <View className="flex-row justify-around">
                <TouchableOpacity 
                    className="mt-60 rounded-lg bg-slate-400 p-3 w-20"
                    onPress={() => navigation.navigate('Notifications')}>
                    <Text className="self-center">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="mt-60 mx-5 rounded-lg bg-slate-400 p-3 w-20"
                    onPress={() => navigation.navigate('Images')}
                    >
                    <Text className="self-center">Next</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default LocationPage;