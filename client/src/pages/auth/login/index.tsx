import LoginForm from '@/components/LoginForm';
import React from 'react';
import api from '@/lib/apis';
const LoginPage = () => {
  api.post(
    '/auth/login',
    {
      username: 'tkksm',
      password: '12341234',
    },
    { withCredentials: true },
  );
  return <LoginForm />;
};

export default LoginPage;
