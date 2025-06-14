'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, Activity, authService, UpdateProfileInput, BioInformation } from '../services/auth';

interface AuthContextType {
    user: User | null;
    token: string | null;
    activities: Activity[];
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, firstName: string, lastName: string) => Promise<void>;
    updateProfile: (data: UpdateProfileInput) => Promise<void>;
    updateBioInformation: (bioInfo: BioInformation) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    refreshActivities: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [token, setToken] = useState<string | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        // Check for token in localStorage on mount
        const storedToken = localStorage.getItem('token');
        if (storedToken) {
            setToken(storedToken);
            verifyToken();
        }
    }, []);

    const verifyToken = async () => {
        try {
            const userData = await authService.verifyToken();
            setUser(userData);
            setIsAuthenticated(true);
            await refreshActivities();
        } catch (error) {
            console.error('Token verification failed:', error);
            logout();
        }
    };

    const refreshActivities = async () => {
        if (!token) return;
        try {
            const activities = await authService.getActivities();
            setActivities(activities);
        } catch (error) {
            console.error('Failed to fetch activities:', error);
        }
    };

    const login = async (email: string, password: string) => {
        try {
            const response = await authService.login({ email, password });
            setToken(response.token);
            setUser(response.user);
            setIsAuthenticated(true);
            localStorage.setItem('token', response.token);
            authService.setToken(response.token);
            await refreshActivities();
        } catch (error) {
            console.error('Login failed:', error);
            throw error;
        }
    };

    const register = async (email: string, password: string, firstName: string, lastName: string) => {
        try {
            const { token, user } = await authService.register({ email, password, firstName, lastName });
            setToken(token);
            setUser(user);
            setIsAuthenticated(true);
            localStorage.setItem('token', token);
            authService.setToken(token);
            await refreshActivities();
        } catch (error) {
            console.error('Registration failed:', error);
            throw error;
        }
    };

    const updateProfile = async (data: UpdateProfileInput) => {
        if (!token) {
            throw new Error('Not authenticated');
        }

        try {
            const updatedUser = await authService.updateProfile(data);
            setUser(updatedUser);
            await refreshActivities();
        } catch (error) {
            console.error('Profile update failed:', error);
            throw error;
        }
    };

    const updateBioInformation = async (bioInfo: BioInformation) => {
        if (!token) {
            throw new Error('Not authenticated');
        }

        try {
            await authService.updateBioInformation(bioInfo);
            await refreshActivities();
        } catch (error) {
            console.error('Bio information update failed:', error);
            throw error;
        }
    };

    const logout = () => {
        setUser(null);
        setToken(null);
        setActivities([]);
        setIsAuthenticated(false);
        localStorage.removeItem('token');
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            activities,
            login,
            register,
            updateProfile,
            updateBioInformation,
            logout,
            isAuthenticated,
            refreshActivities
        }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
} 
