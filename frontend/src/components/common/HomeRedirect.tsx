'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthContext';

export const HomeRedirect = () => {
    const objRouter = useRouter();
    const { sToken, isLoading } = useAuth();

    useEffect(() => {
        if (!isLoading) {
            if (sToken) {
                objRouter.push('/dashboard');
            } else {
                objRouter.push('/Login');
            }
        }
    }, [objRouter, sToken, isLoading]);

    return null;
};
