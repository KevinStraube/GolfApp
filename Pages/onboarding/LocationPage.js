import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native'
import React, { useState } from 'react'

const LocationPage = ({ navigation }) => {
    const [enableLocation, setEnableLocation] = useState(false);

    return (
        <SafeAreaView>
            <Text className="text-xl font-semibold mt-8 self-center">Where do you live?</Text>
            <TouchableOpacity 
                className="mt-10 self-center bg-slate-300 p-3 rounded-2xl"
                onPress={setEnableLocation}
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