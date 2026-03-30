"use client";

import React, { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Login, Logout, Register, CheckAuth } from "@/app/services/auth.service";

interface User {
    id: number;
}

interface LoginCredentials {
    identifier: string;
    password: string;
}

interface SignupCredentials {
    username: string;
    email: string;
    password: string;
}

interface AuthContextType {
    user: User | null;
    setUser: (user: User | null) => void;
    isLoading: boolean;
    isInitialLoading: boolean;
    setIsLoading: (isLoading: boolean) => void;
    error: string | null;
    setError: (error: string | null) => void;
    login: (credentials: LoginCredentials) => void;
    signup: (credentials: SignupCredentials) => void;
    logout: () => void;
    clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
    children: ReactNode;
}

export const AuthProvider = ({ children }: AuthProviderProps) => {
    const [isLoading, setIsLoading] = useState(false);
    const [isInitialLoading, setIsInitialLoading] = useState(true);
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const checkAuthStatus = async () => {
            try {
                setIsInitialLoading(true);
                const data = await CheckAuth();
                setUser(data);
                console.log(data);
            } catch (error) {
                setUser(null);
            } finally {
                setIsInitialLoading(false);
            }
        };

        void checkAuthStatus();
    }, []);

    const login = async (credentials: LoginCredentials) => {
        try {
            setIsLoading(true);
            const { identifier, password } = credentials;
            const data = await Login(identifier, password);
            setUser({id: data.userId});
        } catch (error) {
            console.error("Error with login:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const signup = async (credentials: SignupCredentials) => {
        try {
            setIsLoading(true);
            const { username, email, password } = credentials;
            const data = await Register(username, email, password);
            setUser({id: data.userId});
        } catch (error) {
            console.error("Error with registration:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const logout = async () => {
        try {
            setIsLoading(true);
            const data = await Logout();
            setUser(null);
        } catch (error) {
            console.error("Error with logout:", error);
        } finally {
            setIsLoading(false);
        }
    }

    const clearError = () => {
        setError(null);
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                setUser,
                isLoading,
                isInitialLoading,
                setIsLoading,
                error,
                setError,
                clearError,
                login,
                signup,
                logout
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => {
    const context = useContext(AuthContext);

    if (context === undefined) {
        throw new Error("useAuth must be used within an AuthProvider");
    }

    return context;
};