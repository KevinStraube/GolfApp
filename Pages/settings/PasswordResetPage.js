import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard } from 'react-native'
import React, { useState } from 'react'
import Header from '../../components/Header';
import { auth } from '../../firebase';
import { sendPasswordResetEmail } from 'firebase/auth';

//Page is only available if the user is logged in with email/password provider
const PasswordResetPage = ({ navigation }) => {
    const [email, setEmail] = useState('');

    //Sends the user a password reset email
    const resetPassword = () => {
        if (email.length === 0) {
            Alert.alert("Error", "Email cannot be empty");
        } else {
            sendPasswordResetEmail(auth, email)
                .then(() => {
                    Alert.alert("Success", "Please check your email for a password reset link. Check your junk/spam email if it does not appear in your inbox.");
                    navigation.goBack();
                })
                .catch((error) => {
                    console.log("Error sending password reset link:", error.code);
                    if (error.code === 'auth/user-not-found') {
                        Alert.alert("Error", "Email does not exist.");
                    }
                });
        }
    }

    return (
        <SafeAreaView className="h-2/3">
            <Header title="Reset Password"/>
            <KeyboardAvoidingView className="flex-1">
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1 justify-center">
                        <TextInput
                            className="w-4/5 p-3 bg-white rounded-lg self-center border border-slate-300"
                            placeholder='Email Address'
                            value={email}
                            onChangeText={(text) => setEmail(text)}
                        />
                        <TouchableOpacity
                            className="w-4/5 p-3 bg-green-600 mt-5 self-center rounded-lg items-center"
                            onPress={resetPassword}
                        >
                            <Text className="text-white text-base font-medium">Reset Password</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>
            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default PasswordResetPage;