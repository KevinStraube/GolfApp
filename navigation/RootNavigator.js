import React from "react";
import { useAuth } from "../hooks/useAuth";
import LoginStack from './LoginStack';
import OnboardNavigator from "./OnboardNavigator";
import LoadingPage from "../Pages/LoadingPage";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function RootNavigator() {
    //const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    return user ? <OnboardNavigator /> : <LoginStack />
}