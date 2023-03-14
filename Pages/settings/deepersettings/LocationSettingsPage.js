import { View, Text, SafeAreaView, TouchableOpacity, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, StyleSheet } from 'react-native'
import React, { useState } from 'react'
import Header from '../../../components/Header';

const LocationSettingsPage = () => {
    const [location, setLocation] = useState('');

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Location"}/>
                <KeyboardAvoidingView className="flex-1">
                    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                        <View className="flex-1">
                            <Text className="text-lg font-semibold mx-10 mt-5">On The Move?</Text>
                            <Text className="mx-5 my-1 self-center">Allow other golfers to find you by updating your location</Text>
                            <TouchableOpacity className="self-center mt-4 bg-green-700 p-4 rounded-full w-4/5">
                                <Text className="text-white self-center font-medium text-base">Use my location</Text>
                            </TouchableOpacity>
                            <View className="border-b border-slate-300 py-4"></View>
                            <Text className="text-lg font-semibold mx-10 mt-5">Or</Text>
                            <Text className="mx-5 my-1 self-center">Manually set your location by search. Type an address, city or other location to set it.</Text>
                            <TextInput 
                                className="p-3 w-4/5 mt-3 bg-white rounded-lg border border-slate-300 self-center"
                                placeholder='Enter location...'
                                onChangeText={text => setLocation(text)}
                                value={location}
                            />
                             <TouchableOpacity 
                                className="self-center mt-7 bg-green-700 p-4 rounded-full w-4/5"
                                disabled={location.length < 1}
                                style={location.length < 1 ? styles.disabled : styles.enabled}
                            >
                                <Text className="text-white self-center font-medium text-base">Apply</Text>
                            </TouchableOpacity>
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