import { getCurrentUserId, onAuthChange } from "@/utils/backend/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

type AuthState = { 
    userId: string | null | undefined
};

const AuthContext = createContext<AuthState>({ userId: undefined });

export const AuthProvider = ({ children }: {
    children: React.ReactNode
}) => {
    const [userId, setUserId] = useState<string | null | undefined>(undefined);

    useEffect(() => {
        getCurrentUserId().then((id) => setUserId(id));
        const { data: subscription } = onAuthChange(setUserId);
        return () => subscription.subscription.unsubscribe();
    }, []);

    return (
        <AuthContext.Provider value={{ userId }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    return useContext(AuthContext);
}