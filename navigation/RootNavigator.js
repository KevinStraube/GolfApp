import React, { useEffect, useState } from "react";
import LoginStack from './LoginStack';
import LoadingPage from "../Pages/main/LoadingPage";
import OnboardNavigator from "./OnboardNavigator";
import { auth } from "../firebase";
import { onAuthStateChanged } from "firebase/auth";

export default function RootNavigator() {
    const [loading, setLoading] = useState(true);
    const [user, setUser] = useState(null);

    //Define a loading state that waits for user persistence
    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(undefined);
            }
            setLoading(false);
        })
        return unsubscribe
    }, []);
    

    return loading ? <LoadingPage/> : user ? <OnboardNavigator /> : <LoginStack />
}