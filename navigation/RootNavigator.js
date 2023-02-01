import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginStack from './LoginStack';
import LoadingPage from "../Pages/LoadingPage";
import OnboardNavigator from "./OnboardNavigator";

export default function RootNavigator() {
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    })

    return loading? <LoadingPage /> : user ? <OnboardNavigator /> : <LoginStack />
}