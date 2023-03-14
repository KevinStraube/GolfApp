import { View, Text, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet, ActivityIndicator, Alert } from 'react-native'
import React, { useState } from 'react'
import Header from '../../../components/Header';
import * as Location from 'expo-location';
import { auth, firestore } from '../../../firebase';
import { doc, updateDoc } from 'firebase/firestore';

const LocationSettingsPage = () => {
    const [loading, setLoading] = useState(false);
    const [topLoading, setTopLoading] = useState(false);
    const [location, setLocation] = useState('');
    const user = auth.currentUser;

    //User presses button to use their location
    const setUsersLocation = async () => {
        //Show loading indicator
        setTopLoading(true);

        //Get user's current location
        const userLocation = await Location.getCurrentPositionAsync();
        //Using user's latitude/longitude get all location information
        const reverseGeocodedLocation = await Location.reverseGeocodeAsync({latitude: userLocation.coords.latitude, longitude: userLocation.coords.longitude});

        //Update user's location information in the database with new location data
        updateDoc(doc(firestore, 'users', user.uid), {
            city: reverseGeocodedLocation[0].city,
            reverseGeocodedLocation: reverseGeocodedLocation
        })
        .then(() => {
            //Remove loading indicator and display success message
            setTopLoading(false);
            Alert.alert("Success", `Location updated to ${reverseGeocodedLocation[0].city}`);
        })
        .catch((error) => {
            console.log("Error updating location with user location:", error);
        })
    }

    //User types new location and presses apply
    const searchForLocation = async () => {
        //Show loading indicator
        setLoading(true);

        //Get location data using user input
        const geocodedLocation = await Location.geocodeAsync(location);
        //Using location data, extract all location information
        const reverseGeocodedLocation = await Location.reverseGeocodeAsync({latitude: geocodedLocation[0].latitude, longitude: geocodedLocation[0].longitude});

        //Update user's location information in the database with new location data
        updateDoc(doc(firestore, 'users', user.uid), {
            city: reverseGeocodedLocation[0].city,
            reverseGeocodedLocation: reverseGeocodedLocation
        })
        .then(() => {
            //Remove loading indicator and display success message
            setLoading(false);
            Alert.alert('Success', `Location updated to ${reverseGeocodedLocation[0].city}`);
        })
        .catch((error) => {
            console.log("Error updating location:", error);
        })
    }

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Location"}/>
                <KeyboardAvoidingView className="flex-1">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1">
                            <Text className="text-lg font-semibold mx-10 mt-5">On The Move?</Text>
                            <Text className="mx-5 my-1 self-center">Allow other golfers to find you by updating your location</Text>
                            {
                                !topLoading ? 
                                <TouchableOpacity 
                                    className="self-center mt-4 bg-green-700 p-4 rounded-full w-4/5"
                                    onPress={setUsersLocation}
                                >
                                    <Text className="text-white self-center font-medium text-base">Use my location</Text>
                                </TouchableOpacity>
                                :
                                <ActivityIndicator size={"large"} className="mt-9"/>
                            }
                            <View className="border-b border-slate-300 py-4"></View>
                            <Text className="text-lg font-semibold mx-10 mt-5">Or</Text>
                            <Text className="mx-5 my-1 self-center">Manually set your location by search. Type an address, city or other location to set it.</Text>
                            <TextInput 
                                className="p-3 w-4/5 mt-3 bg-white rounded-lg border border-slate-300 self-center"
                                placeholder='Enter location...'
                                onChangeText={text => setLocation(text)}
                                value={location}
                            />
                            {
                                !loading ?
                                <TouchableOpacity 
                                    className="self-center mt-7 bg-green-700 p-4 rounded-full w-4/5"
                                    disabled={location.length < 1}
                                    style={location.length < 1 ? styles.disabled : styles.enabled}
                                    onPress={searchForLocation}
                                >
                                    <Text className="text-white self-center font-medium text-base">Apply</Text>
                                </TouchableOpacity>
                                :
                                <ActivityIndicator size={"large"} className="mt-9"/>
                            }
                            <View className="border-b border-slate-300 py-4"></View>
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

export default LocationSettingsPage;