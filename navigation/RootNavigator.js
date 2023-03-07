import React, { useEffect, useState } from "react";
import { useAuth } from "../hooks/useAuth";
import LoginStack from './LoginStack';
import LoadingPage from "../Pages/main/LoadingPage";
import OnboardNavigator from "./OnboardNavigator";

export default function RootNavigator() {
    //const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    /*
    ** COME BACK TO THIS - INITIAL LOAD PERMANENTLY LOADS ON FIRST **

    useEffect(() => {
        if (user) {
            setLoading(false);
        }
    })
    */

    return user ? <OnboardNavigator /> : <LoginStack />
}