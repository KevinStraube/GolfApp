import React, { useEffect, useState } from "react";
import { auth } from "../firebase";
import { onAuthStateChanged, User } from "firebase/auth";

export function useAuth() {
    const [user, setUser] = useState(User);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                setUser(undefined);
            }
        })

        return unsubscribe
    }, [])

    return {
        user,
    }
}