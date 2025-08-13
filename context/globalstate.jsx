"use client";
import { createContext, useContext, useState } from "react";

const GlobalStateContext = createContext({});

export function GlobalStateProvider({ children }) {
    const [isLoading, setIsLoading] = useState(false);

    const value = {
        isLoading,
        setIsLoading,
    };

    return <GlobalStateContext.Provider value={value}>{children}</GlobalStateContext.Provider>;
}

export function useGlobalState() {
    const context = useContext(GlobalStateContext);
    if (context === undefined) {
        throw new Error("useAuth must be used within an GlobalStateProvider");
    }
    return context;
}
