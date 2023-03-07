import { ActivityIndicator, Alert, SafeAreaView, StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import * as Location from 'expo-location';
import { updateDoc, doc, getFirestore } from 'firebase/firestore';
import { async } from '@firebase/util';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAuth } from '../../hooks/useAuth';
import LoadingPage from '../main/LoadingPage';

const firestore = getFirestore();

/*
Upload location information to database
- city refers to name of the city user is in
- location refers to geocoded data (coordinates, etc.)
- reverseLocation refers to reverse geocoded data (city, country, street address, etc.)
*/

async function uploadLocation(uid, city, location, reverseLocation) {
    try {
        //Fetch doc from database
        const userDoc = doc(firestore, "users", uid);
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

/*
async function registerForLocationAsync() {
    let location;

    let { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
        console.log("status not shown as granted");
        return;
    }

    location = await Location.getCurrentPositionAsync({});
    return location;
}
*/

const LocationPage = ({ navigation }) => {
    const [location, setLocation] = useState('');
    const [loading, setLoading] = useState(false);
    const [city, setCity] = useState('');

    const { user } = useAuth();
    
    const handleLocationEnable = async() => {
        setLoading(true);
        
        /* Requests permission from the user to use location services, returns location data */
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== 'granted') {
            Alert.alert("Error", "Please enable location services to continue");
        }

        let location = await Location.getCurrentPositionAsync({}); 
        setLocation(location);
        setLoading(false);

        console.log(location);

        /* Uses original location data to reverse-geocode */
        try {
            const reverseGeocodedLocation = await Location.reverseGeocodeAsync({
                latitude: location.coords.latitude,
                longitude: location.coords.longitude,
            });
            console.log(reverseGeocodedLocation);
            uploadLocation(user.uid, reverseGeocodedLocation[0].city, location, reverseGeocodedLocation);
            setCity(reverseGeocodedLocation[0].city);
        } 
        catch (e) {
            console.log('Error reverse geocoding location:', e);
        }
    }

    return (
        <SafeAreaView>
            <Text className="text-xl font-semibold mt-8 self-center">Where do you live?</Text>
            <TouchableOpacity 
                className="mt-10 self-center bg-lime-500 py-3 px-4 rounded-full"
                disabled={city.length > 0}
                style={city.length > 0 ? styles.disabled : styles.enabled}
                onPress={handleLocationEnable}
                >
                <Text className="text-white font-semibold self-center">Enable Location</Text>
            </TouchableOpacity>
            {loading && (
                <ActivityIndicator size="large" className="self-center" />
            )}
            <Text className="text-xl self-center mt-7">{city}</Text>
            <View className="flex-row justify-around">
                <TouchableOpacity 
                    className="mt-60 rounded-lg bg-lime-500 p-3 w-20"
                    onPress={() => navigation.navigate('Notifications')}>
                    <Text className="text-white font-semibold self-center">Back</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    className="mt-60 rounded-lg bg-lime-500 p-3 w-20"
                    disabled={location.length < 1}
                    style={location.length < 1 ? styles.disabled : styles.enabled}
                    onPress={() => navigation.navigate('Images')}
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

export default LocationPage;
