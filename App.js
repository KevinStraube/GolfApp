import { StatusBar } from 'expo-status-bar';
import { Text, View } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

export default function App() {
  return (
    <View className="flex-1 justify-center items-center">
      <Ionicons name="golf" size={30} color="green" />
    </View>
  );
}