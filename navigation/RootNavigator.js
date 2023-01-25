import React from "react";
import { useAuth } from "../hooks/useAuth";
import LoginStack from './LoginStack';
import OnboardNavigator from "./OnboardNavigator";

export default function RootNavigator() {
    const { user } = useAuth();

    return user ? <OnboardNavigator /> : <LoginStack />
}