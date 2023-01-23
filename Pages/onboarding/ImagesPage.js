import { SafeAreaView, Text, TouchableOpacity, View } from 'react-native';
import React from 'react';
import { AntDesign } from '@expo/vector-icons';

const ImagesPage = () => {
  return (
    <SafeAreaView>
        <Text className="text-xl font-semibold mt-8 self-center">Pick your photos</Text>
        <View className="mt-5">
            <View className="flex-row gap-5 justify-center items-center">
                <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28">
                    <AntDesign name='plus' size={34} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28">
                    <AntDesign name='plus' size={34} color="gray" />
                </TouchableOpacity>
            </View>
            <View className="flex-row justify-center items-center gap-5 mt-1">
                <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28">
                    <AntDesign name='plus' size={34} color="gray" />
                </TouchableOpacity>
                <TouchableOpacity className="justify-center items-center border-dashed border-2 border-slate-400 rounded-lg h-28 w-28">
                    <AntDesign name='plus' size={34} color="gray" />
                </TouchableOpacity>
            </View>
        </View>
        <TouchableOpacity className="mt-10 mx-5 rounded-lg bg-slate-400 p-3 w-20">
            <Text className="self-center">Next</Text>
        </TouchableOpacity>
    </SafeAreaView>
  );
};

export default ImagesPage;