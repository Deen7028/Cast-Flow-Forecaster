import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useAuth } from '@/components/providers/AuthContext';
import { loginSchema, LoginFormData } from '@/validations/auth.schema';
import { authService } from '@/services/auth.service';
import { IApiResponse, ILoginResponse } from '@/interfaces';

export const useLogin = () => {
  const objRouter = useRouter();
  const { login } = useAuth();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const [sError, setSError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const objForm = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      Username: '',
      Password: '',
      remember: false,
    }
  });

  const onSubmit = async (objData: LoginFormData) => {
    setSError(null);
    setIsLoading(true);

    try {
      const objResult = await authService.login(objData) as IApiResponse<ILoginResponse>;

      if (objResult.status === 'success' && objResult.data?.token) {
        login(objResult.data.user, objResult.data.token);
        objRouter.push('/dashboard');
      } else {
        setSError(objResult.message || 'เข้าสู่ระบบไม่สำเร็จ');
      }
    } catch (objError) {
      const sErrorMessage = objError instanceof Error ? objError.message : 'ไม่สามารถเชื่อมต่อกับ Server ได้ กรุณาลองใหม่อีกครั้ง';
      setSError(sErrorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    objForm,
    isShowPassword,
    setIsShowPassword,
    sError,
    isLoading,
    onSubmit
  };
};
