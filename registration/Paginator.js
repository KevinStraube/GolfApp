import { View, useWindowDimensions, Animated } from 'react-native'
import React from 'react'

const Paginator = ({ data, scrollX }) => {
    const {width} = useWindowDimensions();

    return (
        <View className="flex-row h-10">
            {data?.map((_, i) => {
                //Calculate the indices of the previous, current and next dots
                const inputRange = [(i - 1) * width, i * width, (i + 1) * width];
                
                /*
                Expand focused dot 
                const dotWidth = scrollX.interpolate({
                    inputRange,
                    outputRange: [10, 20, 10],
                    extrapolate: 'clamp',
                })
                */
                
                //Set the opacity of the focused dot
                const opacity = scrollX.interpolate({
                    inputRange,
                    outputRange: [0.3, 1, 0.3],
                    extrapolate: 'clamp',
                })

                return <Animated.View className="h-2 rounded-full bg-white mx-2 w-2" style={{opacity}} key={i.toString()} />
            })}
        </View>
    );
};

export default Paginator;