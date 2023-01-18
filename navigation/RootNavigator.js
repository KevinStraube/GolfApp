import React from "react";
import { useAuth } from "../hooks/useAuth";
import LoginStack from './LoginStack';
import TabNavigator from "./TabNavigator";

export default function RootNavigator() {
    const { user } = useAuth();

    return user ? <TabNavigator /> : <LoginStack />
}