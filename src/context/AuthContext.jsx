import React, { createContext, useContext, useState, useEffect } from 'react';
import { ROLE_PERMISSIONS } from '../utils/rolePermissions';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(() => {
        try {
            const savedUser = localStorage.getItem('user');
            return savedUser ? JSON.parse(savedUser) : null;
        } catch (error) {
            console.error("Error parsing user from localStorage:", error);
            localStorage.removeItem('user');
            return null;
        }
    });

    // ✅ LOGIN FUNCTION
    const login = (userData) => {
        const permissions = ROLE_PERMISSIONS[userData.role] || [];
        const fullUser = { 
            id: userData.id,
            email: userData.email,
            fullName: userData.fullName,
            role: userData.role,
            token: userData.token, // Store Token
            permissions 
        };

        setUser(fullUser);
        localStorage.setItem('user', JSON.stringify(fullUser));
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('user');
    };

    // Synchronize localStorage across tabs
    useEffect(() => {
        const handleStorageChange = (e) => {
            if (e.key === 'user' && !e.newValue) {
                setUser(null);
            }
        };
        window.addEventListener('storage', handleStorageChange);
        return () => window.removeEventListener('storage', handleStorageChange);
    }, []);

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
};