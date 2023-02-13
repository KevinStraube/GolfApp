import { View, Text, SafeAreaView, TextInput, KeyboardAvoidingView, TouchableWithoutFeedback, Keyboard, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header';
import { useAuth } from '../../../hooks/useAuth';
import { updateEmail, getAuth } from 'firebase/auth';

const ChangeEmailPage = ({navigation}) => {
    const [email, setEmail] = useState('');
    const [confirmEmail, setConfirmEmail] = useState('');
    const [matched, setMatched] = useState(true);
    const { user } = useAuth();

    const auth = getAuth();

    const updateEmailAddress = () => {
        if (email !== confirmEmail) {
            setMatched(false);
        } else {
            setMatched(true);
            
            /*
            updateEmail(auth.currentUser, email).then(() => {
                Alert.alert("Success", "Email updated successfully");
                navigation.goBack();
            }).catch((error) => {
                console.log("Error updating user email:", error);
            });
            */
        }
    }

    useEffect(() => {
        if (!user) {
            console.log("User is loading...");
        } else {
            console.log(user);
        }
    }, [user]);

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Change Email"}/>
            <KeyboardAvoidingView
                behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
                className="flex-1"
                keyboardVerticalOffset={10}
            >
                <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
                    <View className="flex-1">
                        <Text className="mx-5 mt-4 font-semibold text-lg">Current Email</Text>
                        <Text className="mx-5 text-base">{user?.email}</Text>

                        <Text className="mx-5 mt-7 font-semibold text-lg">New Email</Text>
                        <TextInput 
                            className="w-4/5 border border-slate-300 border-solid py-3 px-2 bg-white mx-5 rounded-lg mt-2"
                            keyboardType='email-address'
                            onChangeText={text => setEmail(text)}
                        />

                        <Text className="mx-5 mt-7 font-semibold text-lg">Confirm Email</Text>
                        {matched ? <TextInput 
                            className="w-4/5 border border-slate-300 border-solid py-3 px-2 bg-white mx-5 rounded-lg mt-2"
                            keyboardType='email-address'
                            onChangeText={text => setConfirmEmail(text)}
                        /> : <View>
                                <TextInput 
                                    className="w-4/5 border border-rose-500 border-solid py-3 px-2 bg-white mx-5 rounded-lg mt-2"
                                    keyboardType='email-address'
                                    onChangeText={text => setConfirmEmail(text)}
                                    value={confirmEmail}
                                />
                                <Text className="mx-5 my-2 text-rose-500">Emails do not match</Text>
                            </View>
                        }

                        <TouchableOpacity 
                            className="w-5/6 py-3 px-3 bg-lime-600 rounded-lg self-center mt-12"
                            onPress={updateEmailAddress}
                        >
                            <Text className="self-center text-white font-bold text-base">Submit</Text>
                        </TouchableOpacity>
                    </View>
                </TouchableWithoutFeedback>

            </KeyboardAvoidingView>
        </SafeAreaView>
    );
};

export default ChangeEmailPage;