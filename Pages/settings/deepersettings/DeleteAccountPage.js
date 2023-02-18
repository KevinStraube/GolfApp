import { View, Text, SafeAreaView, TouchableOpacity, TextInput } from 'react-native'
import React, { useEffect, useState } from 'react'
import Header from '../../../components/Header';
import BouncyCheckbox from 'react-native-bouncy-checkbox';
import { useAuth } from '../../../hooks/useAuth';
import { deleteUser, EmailAuthProvider, reauthenticateWithCredential } from 'firebase/auth';
import { Ionicons } from '@expo/vector-icons';

const DeleteAccount = () => {
    const [understand, setUnderstand] = useState(false);
    const [authenticated, setAuthenticated] = useState(false);
    const [incorrectPassword, setIncorrectPassword] = useState(false);
    const [password, setPassword] = useState('');

    const { user } = useAuth();

    useEffect(() => {
        if (!user) {
            console.log("User is loading...");
        }
    }, [user]);

    const deleteAccount = () => {
        deleteUser(user).then(() => {
            console.log("User deleted");
        })
        .catch((error) => {
            console.log("Error deleting user:", error);
        })
    }

    const reauthenticateUser = () => {
        const credential = EmailAuthProvider.credential(user.email, password);
        reauthenticateWithCredential(user, credential).then(() => {
            setAuthenticated(true);
        }).catch((error) => {
            console.log("Error signing in:", error);
            setIncorrectPassword(true);
        });
    }

    return (
        <SafeAreaView className="flex-1">
            <Header title={"Delete Account"}/>
            {
            !authenticated &&
            <View>
                <Text className="mx-5 mt-3 text-base">Enter your password</Text>
                <View className="flex-row items-center">
                    {
                        incorrectPassword ? 
                        <TextInput
                        className="w-2/3 ml-5 mt-2 py-3 px-3 bg-white rounded-lg border border-rose-500"
                        onChangeText={(text) => setPassword(text)}
                        secureTextEntry
                        />
                        :
                        <TextInput
                            className="w-2/3 ml-5 mt-2 py-3 px-3 bg-white rounded-lg border border-slate-300"
                            onChangeText={(text) => setPassword(text)}
                            secureTextEntry
                        />
                    }
                    <TouchableOpacity 
                        className="p-2 ml-3 bg-lime-500 rounded-lg mt-2"
                        onPress={reauthenticateUser}
                    >
                        <Ionicons name='checkmark' size={22} color="white"/>
                    </TouchableOpacity>
                </View>
                {
                    incorrectPassword &&
                    <Text className="mt-1 ml-5 text-rose-500">Incorrect password</Text>
                }
            </View>
            }
            {
            authenticated &&
            <View>
                <Text className="text-lg mx-5 mt-5">Deleting your account means all your data will be removed. This action is permanent and cannot be undone.</Text>
                <View className="h-1/4 mx-5 mt-5">
                    <BouncyCheckbox
                        size={20}
                        fillColor='green'
                        unfillColor='#FFFFFF'
                        text='I understand'
                        iconStyle={{ borderColor: "green" }}
                        textStyle={{textDecorationLine: "none", color: "black", fontSize:18}}
                        onPress={() => setUnderstand(!understand)}
                        isChecked={understand}
                    />
                </View>
            
            </View>
            }
            {
                understand &&
                <TouchableOpacity 
                    className="w-4/5 mt-7 mx-4 py-3 bg-white rounded-lg justify-end self-center border border-rose-500"
                    onPress={deleteAccount}
                >
                    <Text className="text-rose-500 font-semibold text-center">Delete Account</Text>
                </TouchableOpacity>
            }
        </SafeAreaView>
    );
};

export default DeleteAccount;