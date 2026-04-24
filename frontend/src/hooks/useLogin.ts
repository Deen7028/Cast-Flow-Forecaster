import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/providers/AuthContext';
import { loginSchema, LoginFormData } from '@/validations/auth.schema';

export const useLogin = () => {
  const router = useRouter();
  const { login } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [sError, setSError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Username: '',
      Password: '',
      remember: false,
    }
  });

  const onSubmit = async (data: LoginFormData) => {
    setSError(null);
    setIsLoading(true);

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/Auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          Username: data.Username,
          Password: data.Password,
        }),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          login(result.user, result.token);
        }
        router.push('/dashboard');
      } else {
        setSError(result.message || 'Username หรือ Password ไม่ถูกต้อง');
      }
    } catch (err) {
      setSError('ไม่สามารถเชื่อมต่อกับ Server ได้ กรุณาลองใหม่อีกครั้ง');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    form,
    showPassword,
    setShowPassword,
    sError,
    isLoading,
    onSubmit
  };
};
