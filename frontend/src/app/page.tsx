'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/components/providers/AuthContext';

export default function Home() {
  const router = useRouter();
  const { token, isLoading } = useAuth();

  useEffect(() => {
    if (!isLoading) {
      if (token) {
        router.push('/dashboard');
      } else {
        router.push('/Login');
      }
    }
  }, [router, token, isLoading]);

  return null;
}
