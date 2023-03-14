import { View, Text, SafeAreaView, FlatList, Switch, TouchableOpacity, Alert } from 'react-native'
import React, { useEffect, useLayoutEffect, useState } from 'react'
import Header from '../../components/Header';
import SettingsRow from '../../components/SettingsRow';
import { Ionicons } from '@expo/vector-icons';
import { useAuth } from '../../hooks/useAuth';
import { doc, getDoc, updateDoc } from 'firebase/firestore';
import { auth, firestore } from '../../firebase';
import { updatePassword } from 'firebase/auth';

//List of options within the settings tab
const data = [
    {
        id: 0,
        title: "Change Email",
        icon: "mail-outline",
        page: "Reauthenticate",
    },
    {
        id: 1,
        title: "Change Password",
        icon: "lock-closed-outline",
        page: "ChangePassword",
    },
    {
        id: 2,
        title: "Delete Account",
        icon: "trash-outline",
        page: "DeleteAccount",
    },
];

const ChangeSettingsPage = () => {
    const [paused, setPaused] = useState(false);

    const user = auth.currentUser;

    useLayoutEffect(() => {
        getDoc(doc(firestore, 'users', user.uid))
        .then((snapshot) => {
            const userData = snapshot.data();
            setPaused(userData.paused);
        });
    }, [])

    const togglePauseSwitch = () => {
        let newPaused = !paused;
        updateDoc(doc(firestore, 'users', user.uid), {
            paused: newPaused,
        })
        setPaused(prevState => !prevState);
    }

    const showPauseInfo = () => {
        Alert.alert('Pause Matches', 'While your matches are paused, your profile will no longer appear to other people. You can still message current matches and use the app normally otherwise');
    }

    return (
        <SafeAreaView>
            <Header title={"Settings"}/>
            <View className="flex-row items-center py-2 border-b border-slate-300 px-5">
                <Text>Pause Matches</Text>
                <TouchableOpacity className="ml-2" onPress={showPauseInfo}>
                    <Ionicons name='information-circle-outline' size={19} color='green'/>
                </TouchableOpacity>
                <View className="ml-auto">
                    <Switch
                        onValueChange={togglePauseSwitch}
                        value={paused}
                    />
                </View>
            </View>
            <FlatList
                className="h-full"
                data={data}
                keyExtractor={item => item.id}
                renderItem={({item}) => <SettingsRow title={item.title} icon={item.icon} page={item.page}/>}
                scrollEnabled={false}
            />
        </SafeAreaView>
    );
};

export default ChangeSettingsPage;