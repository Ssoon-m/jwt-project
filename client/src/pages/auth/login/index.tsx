import LoginForm from '@/components/LoginForm';
import React from 'react';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { getCookie } from 'cookies-next';
const LoginPage = () => {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async ({ req, res }) => {
  const accessToken = getCookie('access_token', { req });
  if (accessToken) {
    alert('로그인 상태 이므로 로그인 페이지 안 가짐');
    return {
      redirect: {
        destination: '/',
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};
