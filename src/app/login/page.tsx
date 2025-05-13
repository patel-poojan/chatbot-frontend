'use client';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useLogin, useLogout } from '@/utils/auth-api';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useState, useCallback } from 'react';
import { IoEyeOffOutline, IoEyeOutline } from 'react-icons/io5';
import { toast } from 'sonner';
import { Loader } from '../components/Loader';
import { axiosError } from '../../types/axiosTypes';
import Cookies from 'js-cookie';

const Page = () => {
  const router = useRouter();
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [passwordType, setPasswordType] = useState<string>('password');

  const togglePassword = useCallback(() => {
    setPasswordType((prev) => (prev === 'password' ? 'text' : 'password'));
  }, []);
  const { mutate: isLogout, isPending: isPendingLogout } = useLogout({
    onSuccess() {
      router.push('/login');
    },
  });
  const { mutate: onLogin, isPending } = useLogin({
    onSuccess(data) {
      const token = data.data.accessToken;
      const userRole = data.data.user.userRole;
      const permissions = data.data.user.permissions || [];

      if (token) {
        if (data.data.user.username) {
          Cookies.set('username', data.data.user.username, {
            path: '/',
            sameSite: 'Lax',
            secure: true,
          });
          Cookies.set('email', data.data.user.email, {
            path: '/',
            sameSite: 'Lax',
            secure: true,
          });
        }
        if (data.data.user.userRole) {
          Cookies.set('userRole', data.data.user.userRole, {
            path: '/',
            sameSite: 'Lax',
            secure: true,
          });
        }
        if (data.data.user.permissions) {
          Cookies.set(
            'permissions',
            JSON.stringify(data.data.user.permissions),
            {
              path: '/',
              sameSite: 'Lax',
              secure: true,
            }
          );
        }
        Cookies.set('authToken', token, {
          path: '/',
          sameSite: 'Lax',
          secure: true,
        });

        if (userRole === 'user') {
          router.push('/statistics-dashboard-user');
        } else if (userRole === 'admin') {
          router.push('/statistics-dashboard');
        } else if (userRole === 'subadmin') {
          // Cascading permission checks for subadmin
          if (permissions.includes('ADMIN_DASHBOARD')) {
            router.push('/statistics-dashboard');
          } else if (permissions.includes('CREATE_CHATAGENTS')) {
            router.push('/statistics-dashboard-user');
          } else if (permissions.includes('MANAGE_USERS')) {
            router.push('/users');
          } else if (permissions.includes('BDA_QUESTION_MANAGEMENT')) {
            router.push('/bda');
          } else {
            // No permitted roles, show toast and don't navigate
            toast.error('You do not have any permission');
            isLogout(); // Logout the user
            return; // Exit early to prevent success toast and navigation
          }
        }
      }
      toast.success(data?.message);
    },

    onError(error: axiosError) {
      const errorMessage =
        error?.response?.data?.errors?.message ||
        error?.response?.data?.message ||
        'Login failed';
      toast.error(errorMessage);
    },
  });

  const handleSubmit = useCallback(
    (
      e: React.FormEvent<HTMLFormElement> | React.MouseEvent<HTMLButtonElement>
    ) => {
      e.preventDefault();

      if (!email) {
        toast.warning('Please fill in your email address');
      } else if (!password) {
        toast.warning('Please fill in your password');
      } else {
        onLogin({ email, password });
      }
    },
    [email, onLogin, password]
  );

  return (
    <div className='h-dvh w-dvw flex justify-center items-center'>
      {(isPending || isPendingLogout) && <Loader />}
      <form
        onSubmit={handleSubmit}
        className='flex flex-col gap-4 md:gap-6 w-full max-w-lg px-4'
      >
        <div className='flex flex-col gap-1 md:gap-2 justify-center items-center'>
          <Image
            src='/images/bot-icon.svg'
            alt='chatbot logo'
            width={45}
            height={45}
            priority
            quality={100}
          />
          <p className='text-black font-medium text-2xl md:text-[32px]'>
            Welcome back
          </p>
        </div>
        <div className='w-full'>
          <label htmlFor='email' className='text-black font-normal text-lg'>
            Email Address
          </label>
          <Input
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            id='email'
            className='px-4 py-3 mt-1 rounded  focus-visible:ring-0 placeholder:text-sm placeholder:font-light w-full'
            placeholder='Enter Your Email Address'
          />
        </div>
        <div className='w-full'>
          <label htmlFor='password' className='text-black font-normal text-lg'>
            Password
          </label>
          <div className='flex items-center border w-full rounded mt-1'>
            <Input
              id='password'
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              type={passwordType}
              className='px-4 py-3 flex-1 !border-none rounded focus-visible:ring-0  placeholder:text-sm w-full'
              placeholder='Enter Your Password'
            />
            <div className='cursor-pointer me-3' onClick={togglePassword}>
              {passwordType === 'password' ? (
                <IoEyeOffOutline />
              ) : (
                <IoEyeOutline />
              )}
            </div>
          </div>
        </div>
        <div className='flex justify-end font-normal text-sm sm:text-base '>
          <a
            href='#'
            className='hover:underline underline-offset-1 text-[#57C0DD] hover:text-[#45A9B8]'
            onClick={() => router.push('/forgetpassword')}
          >
            Forgot Password?
          </a>
        </div>
        <Button
          type='submit'
          className='w-full text-white bg-gradient-to-r hover:from-[#53A7DD] hover:to-[#58C8DD]  from-[#58C8DD] to-[#53A7DD] py-3 rounded'
        >
          Log in
        </Button>
        <div className='text-center text-[#1E255EB2] font-normal text-sm sm:text-lg'>
          Don’t have an account?{' '}
          <a
            href='signup'
            className='text-[#57C0DD] ms-1 hover:text-[#45A9B8] underline-offset-2 hover:underline'
          >
            Sign up
          </a>
        </div>
      </form>
    </div>
  );
};

export default Page;
