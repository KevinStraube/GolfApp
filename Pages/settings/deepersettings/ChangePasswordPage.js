import { View, Text, SafeAreaView, TextInput, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header';
import { useAuth } from '../../../hooks/useAuth';
import { EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';

const ChangePasswordPage = ({ navigation }) => {
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [isMatched, setIsMatched] = useState(true);
    const [wrongPassword, setWrongPassword] = useState(false);
    const [errorMessage, setErrorMessage] = useState(null);

    const { user } = useAuth();

    const submitNewPassword = () => {
        if (newPassword !== confirmPassword) {
            setWrongPassword(false);
            setIsMatched(false);
            setErrorMessage("New passwords do not match");
        } else {
            setIsMatched(true);
            const credential = EmailAuthProvider.credential(user.email, currentPassword);
            reauthenticateWithCredential(user, credential).then(() => {
                updatePassword(user, newPassword).then(() => {
                    Alert.alert("Success", "Password updated");
                    navigation.goBack();
                })
                .catch((error) => {
                    console.log("Error updating password:", error);
                });
            })
            .catch(() => {
                setWrongPassword(true);
                setErrorMessage("Incorrect password");
            })
        }
    }

    useEffect(() => {
        if (!user) {
            console.log("User loading...");
        }
    }, [user]);

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Change Password"}/>
            <View className="flex-1 items-center">
                <View className="mt-10 w-full items-center">
                    {
                        errorMessage && <Text className="text-rose-500">{errorMessage}</Text>
                    }
                    {
                        wrongPassword ? 
                        (<TextInput 
                            className="px-3 py-3 w-4/5 bg-white rounded-lg border border-rose-500 mt-2"
                            placeholder='Current Password'
                            onChangeText={text => setCurrentPassword(text)}
                            secureTextEntry
                        />)
                        :
                        (<TextInput 
                            className="px-3 py-3 w-4/5 bg-white rounded-lg border border-slate-200 mt-2"
                            placeholder='Current Password'
                            onChangeText={text => setCurrentPassword(text)}
                            secureTextEntry
                        />)
                    }
                </View>
                <TextInput 
                    className="px-3 py-3 w-4/5 bg-white rounded-lg mt-3 border border-slate-200"
                    placeholder='New Password'
                    onChangeText={text => setNewPassword(text)}
                    secureTextEntry
                />
                {
                    !isMatched ? 
                    (<TextInput 
                        className="px-3 py-3 w-4/5 bg-white rounded-lg mt-3 border border-rose-500"
                        placeholder='Confirm New Password'
                        onChangeText={text => setConfirmPassword(text)}
                        secureTextEntry
                    />)
                    :
                    (<TextInput 
                        className="px-3 py-3 w-4/5 bg-white rounded-lg mt-3 border border-slate-200"
                        placeholder='Confirm New Password'
                        onChangeText={text => setConfirmPassword(text)}
                        secureTextEntry
                    />)
                } 

                <TouchableOpacity 
                    className="w-4/5 items-center justify-center py-3 bg-lime-500 rounded-lg mt-5"
                    onPress={submitNewPassword}
                >
                    <Text className="text-white font-semibold text-base">Submit</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

export default ChangePasswordPage;