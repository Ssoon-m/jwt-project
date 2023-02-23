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
