"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { auth } from "@/lib/auth/auth";

const AuthContext = createContext({});

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        checkAuthStatus();
    }, []);

    const checkAuthStatus = async () => {
        try {
            setIsLoading(true);
            const authData = await auth.checkAuth();
            setIsAuthenticated(authData.isAuthenticated);
            setUser(authData.user);
        } catch (error) {
            console.error("Auth check failed:", error);
            setIsAuthenticated(false);
            setUser(null);
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (email, password) => {
        const data = await auth.login(email, password);
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("access", data.token);
        return data;
    };

    const register = async (name, email, password) => {
        const data = await auth.register(name, email, password);
        setIsAuthenticated(true);
        setUser(data.user);
        localStorage.setItem("access", data.token);
        return data;
    };

    const logout = async () => {
        await auth.logout();
        setIsAuthenticated(false);
        setUser(null);
    };

    const value = {
        user,
        isAuthenticated,
        isLoading,
        login,
        register,
        logout,
        refreshAuth: checkAuthStatus,
    };

    return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}
