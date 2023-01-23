import { StyleSheet, Text, View, ActivityIndicator } from 'react-native'
import React from 'react'

const LoadingPage = () => {
    return (
    <View className="flex-1 justify-center items-center">
        <ActivityIndicator size="large" />
    </View>
  );
};

export default LoadingPage;