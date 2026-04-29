'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useRouter } from 'next/navigation';

import { IUser } from '@/interfaces';

interface IAuthContextType {
    objUser: IUser | null;
    sToken: string | null;
    login: (objUser: IUser, sToken: string) => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<IAuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [objUser, setObjUser] = useState<IUser | null>(() => {
        if (typeof window !== 'undefined') {
            const sStoredUser = localStorage.getItem('user');
            return sStoredUser ? JSON.parse(sStoredUser) : null;
        }
        return null;
    });
    const [sToken, setSToken] = useState<string | null>(() => {
        if (typeof window !== 'undefined') {
            return localStorage.getItem('token');
        }
        return null;
    });
    const [isLoading, setIsLoading] = useState(true);
    const objRouter = useRouter();

    useEffect(() => {
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setIsLoading(false);
    }, []);

    const login = (objUserData: IUser, sUserToken: string) => {
        setObjUser(objUserData);
        setSToken(sUserToken);
        localStorage.setItem('user', JSON.stringify(objUserData));
        localStorage.setItem('token', sUserToken);
    };

    const logout = () => {
        setObjUser(null);
        setSToken(null);
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        objRouter.push('/Login');
    };

    return (
        <AuthContext.Provider value={{ objUser, sToken, login, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
