import {createContext, useContext, useEffect, useMemo, useState} from "react";
import * as authApi from "../api/auth.api.js";

const AuthContext = createContext(null)

export function AuthProvider({children}) {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    async function refresh() {
        try {
            const data = await authApi.me();
            setUser(data.user);
        } catch {
            setUser(null);
        } finally {
            setLoading(false);
        }
    }

    useEffect(() => {
        refresh();
    }, []);

    const value = useMemo(
        () => ({
            user,
            loading,
            refresh,
            async login (email, password) {
                await authApi.login(email, password);
                await refresh();
            },
            async register(email, password) {
                await authApi.register(email, password);
                await refresh();
            },
            async logout() {
                await authApi.logout();
                setUser(null);
            }
        }),

        [user, loading]
    );

    return <AuthContext.Provider value = {value}>{children}</AuthContext.Provider>
}

export function useAuth() {
    const context = useContext(AuthContext);
    
    if (!context) {
        throw new Error("useAuth must be used within <AuthProvider>");
    }

    return context;
}