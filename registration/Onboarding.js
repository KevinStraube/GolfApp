import React, { useRef, useState } from "react";
import { FlatList, SafeAreaView, Text, View, Animated } from "react-native";
import slides from "./slides";
import Paginator from "./Paginator";

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



