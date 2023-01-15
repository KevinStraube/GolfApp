import React, { createContext, useContext } from "react";
import { View } from "react-native";
import * as Google from "expo-auth-session/providers/google";

const AuthContext= createContext({});

export const AuthProvider = ({ children }) => {

    return (
        <AuthContext.Provider 
        value={{
            user: null,
        }}>
            {children}
        </AuthContext.Provider>
    );
};

export default function useAuth() {
    return useContext(AuthContext);
}