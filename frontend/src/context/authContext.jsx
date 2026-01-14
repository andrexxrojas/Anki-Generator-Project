import { createContext, useContext, useState, useEffect } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const API_URL = import.meta.env.VITE_API_URL;

    // Check if user is logged in on mount
    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_URL}/auth/me`, {
                    method: "GET",
                    credentials: "include" // important: send cookies
                });
                if (!res.ok) throw new Error("Not authenticated");
                const data = await res.json();
                setUser(data.user);
            } catch {
                setUser(null);
            } finally {
                setLoading(false);
            }
        };

        checkAuth();
    }, []);

    // Login function
    const login = async (identifier, password) => {
        const res = await fetch(`${API_URL}/auth/login`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ identifier, password })
        });

        const data = await res.json();

        if (res.ok) {
            setUser({ id: data.userId || null });
        } else {
            throw new Error(data.error || "Login failed");
        }

        return data;
    };

    // Logout function
    const logout = async () => {
        await fetch(`${API_URL}/auth/logout`, {
            method: "POST",
            credentials: "include"
        });
        setUser(null);
    };

    const register = async (username, email, password) => {
        const res = await fetch(`${API_URL}/auth/register`, {
            method: "POST",
            credentials: "include",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ username, email, password })
        });

        const data = await res.json();

        if (res.ok) {
            setUser({ id: data.userId || null });
        } else {
            throw new Error(data.error || "Register failed");
        }

        return data;
    }

    return (
        <AuthContext.Provider value={{ user, login, logout, loading }}>
            {children}
        </AuthContext.Provider>
    );
};

// Custom hook
export const useAuth = () => useContext(AuthContext);
