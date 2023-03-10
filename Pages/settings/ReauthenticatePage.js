import { View, Text, SafeAreaView, TextInput, TouchableOpacity } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../components/Header';
import { getAuth, reauthenticateWithCredential, EmailAuthProvider } from 'firebase/auth';
import { useAuth } from '../../hooks/useAuth';

const ReauthenticatePage = ({navigation}) => {
    const [password, setPassword] = useState('');
    const { user } = useAuth();

    const reAuthenticate = () => {
        //Get new credential by providing login details
        const credential = EmailAuthProvider.credential(user.email, password);

        //Get new authentication token by calling reauthenticate
        //This is necessary because resetting email will not work if it has been too long since user has signed in
        reauthenticateWithCredential(user, credential).then(() => {
            navigation.navigate('ChangeEmail');
        }).catch((error) => {
            console.log("Error re-authenticating user:", error);
        })
    }

    //Load user data
    useEffect(() => {
        if (!user) {
            console.log("User is loading...");
        } else {
            console.log(user);
        }
    }, [user]);

    return (
        <SafeAreaView>
            <Header title={"Enter password"}/>
            <Text className="mx-5 mt-4 font-bold text-lg">Please enter your password</Text>
            <TextInput 
                className="w-5/6 mx-5 px-3 py-3 mt-3 bg-white rounded-lg border border-solid border-slate-300"
                secureTextEntry
                onChangeText={text => setPassword(text)}
            />
            <TouchableOpacity 
                className="w-5/6 py-3 px-3 bg-green-700 rounded-lg self-center mt-12"
                onPress={reAuthenticate}
            >
                <Text className="self-center text-white font-bold text-base">Submit</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default ReauthenticatePage;