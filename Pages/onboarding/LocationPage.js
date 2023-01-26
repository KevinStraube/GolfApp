import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'
import * as Location from 'expo-location';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { async } from '@firebase/util';
import AsyncStorage from '@react-native-async-storage/async-storage';

const firestore = getFirestore();

async function uploadLocation(city, location, reverseLocation) {
    try {
        //Pull user's document ID from async storage
        const docID = await AsyncStorage.getItem('@userCollectionID');
        if (docID !== null) {
            console.log('Fetched ID:', docID);
            try {
                //Fetch doc from database
                const userDoc = doc(firestore, "users", docID);
                await updateDoc(userDoc, {
                    city: city,
                    location: location,
                    reverseGeocodedLocation: reverseLocation,
                });
                console.log("Uploaded location to database");
            } catch (e) {
                console.log('Error uploading location data to database', e);
            }
        }
    } catch (error) {
        console.log('Error fetching @userCollectionID', error);
    }
}  

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
    const [location, setLocation] = useState('');

    const reverseGeocodeLocation = async () => {
        try {
            const reverseGeocodedLocation = await Location.reverseGeocodeAsync({
                latitude:location.coords.latitude,
                longitude: location.coords.longitude,
            });
            console.log(reverseGeocodedLocation);
            uploadLocation(reverseGeocodedLocation[0].city, location, reverseGeocodedLocation);
        } 
        catch (e) {
            console.log('Error reverse geocoding location:', e);
        }
    }

    const handleLocationEnable = async() => {
        let loc = await registerForLocationAsync();
        setLocation(loc);
        console.log(location);
        reverseGeocodeLocation();
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