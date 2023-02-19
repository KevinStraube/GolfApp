import { View, Text, SafeAreaView } from 'react-native'
import React from 'react'
import { useRoute } from '@react-navigation/native';
import Header from '../../components/Header';

const MatchProfilePage = ({ navigation }) => {
    //const {params} = useRoute();

    //const {matchDetails} = params;

    return (
        <SafeAreaView>
            <Header title={"Name"}/>
            <Text>MatchProfilePage</Text>
        </SafeAreaView>
    );
};

export default MatchProfilePage;