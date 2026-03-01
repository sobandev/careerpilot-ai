'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/lib/supabase';
import api from '@/lib/api';

interface User {
    id: string;
    email: string;
    full_name: string;
    role: 'jobseeker' | 'employer' | 'admin';
    avatar_url?: string;
    phone?: string;
    location?: string;
}

interface AuthContextType {
    user: User | null;
    loading: boolean;
    login: (email: string, password: string) => Promise<void>;
    register: (email: string, password: string, fullName: string, role: string) => Promise<void>;
    logout: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Hydrate UI state quickly from localStorage if available
        const storedUser = localStorage.getItem('cp_user');
        if (storedUser) {
            setUser(JSON.parse(storedUser));
        }

        // Always verify with backend using the HttpOnly cookie
        api.getMe().then((data: any) => {
            if (data && data.id) {
                setUser(data);
                localStorage.setItem('cp_user', JSON.stringify(data));
            } else {
                setUser(null);
                localStorage.removeItem('cp_user');
                api.setToken(null);
            }
        }).catch(() => {
            setUser(null);
            localStorage.removeItem('cp_user');
            api.setToken(null);
        }).finally(() => {
            setLoading(false);
        });
    }, []);

    const login = async (email: string, password: string) => {
        const data = await api.login(email, password);
        api.setToken(data.access_token);
        const userData = data.user as unknown as User;
        setUser(userData);
        localStorage.setItem('cp_user', JSON.stringify(userData));
    };

    const register = async (email: string, password: string, fullName: string, role: string) => {
        await api.register(email, password, fullName, role);
        await login(email, password);
    };

    const logout = async () => {
        setUser(null);
        localStorage.removeItem('cp_user');
        api.setToken(null);
        try {
            await api.request('/api/auth/logout', { method: 'POST' });
        } catch (e) {
            console.error("Logout error", e);
        }
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) throw new Error('useAuth must be used within AuthProvider');
    return context;
}
