import React, { useRef, useState } from "react";
import { FlatList, SafeAreaView, Text, View, Animated, TouchableOpacity } from "react-native";
import slides from "./slides";
import Paginator from "./Paginator";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { signOut } from "firebase/auth";
import { auth } from "../firebase";

const Onboarding = ({ navigation }) => {
    const signout = () => {
        signOut(auth)
        .catch((error) => {
            console.log(error);
        })
    }
    return (
        <SafeAreaView className="flex-1 items-center">
            <Text className="text-2xl font-semibold mt-12">Welcome to Clubhouse Golf!</Text>
            <Text className="text-xl font-semibold my-12">We just need to ask a few questions</Text>
            <TouchableOpacity 
                className="bg-green-700 p-3 rounded-lg w-1/5"
                onPress={() => navigation.navigate('BasicInfo')}
                >
                <Text className="self-center text-white font-semibold">Next</Text>
            </TouchableOpacity>

            <TouchableOpacity 
                className="bg-green-700 p-3 rounded-lg w-1/5 mt-5"
                onPress={signout}
            >
                <Text className="self-center text-white font-semibold">Cancel</Text>
            </TouchableOpacity>
        </SafeAreaView>
    );
};

export default Onboarding;

/*
** CODE USING FLATLIST **

const Item = ({title}) => (
    <View className="flex-1 justify-center items-center w-screen">
        <Text className="text-xl font-semibold mb-10 text-center">{title}</Text>
    </View>
);

const Onboarding = () => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const scrollX = useRef(new Animated.Value(0)).current;
    const slidesRef = useRef(null);

    const viewableItemsChanged = useRef(({ viewableItems }) => {
        setCurrentIndex(viewableItems[0].index);
    }).current;

    const viewConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

    const scrollTo = async () => {
        if (currentIndex < slides.length - 1) {
            slidesRef.current.scrollToIndex({ index: currentIndex + 1});
        } else {
            try {
                await AsyncStorage.setItem('@viewedOnboarding', 'true');
            } catch (error) {
                console.log("Error @setItem: ", error);
            }
        }
    };

    return (
        <SafeAreaView className="flex-1 justify-center items-center">
            <FlatList 
                data={slides}
                renderItem={({ item }) => <Item title={item.title} /> } 
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                bounces={false}
                onScroll={Animated.event([{nativeEvent: {contentOffset: { x: scrollX } } }], {
                    useNativeDriver: false,
                })}
                onViewableItemsChanged={viewableItemsChanged}
                viewabilityConfig={viewConfig}
                ref={slidesRef}
            />
            <Paginator data={slides} scrollX={scrollX} />
        </SafeAreaView>
    );
};

export default Onboarding;
*/


