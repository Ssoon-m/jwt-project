import LoginForm from '@/components/LoginForm';
import React from 'react';
import Layout from '@/components/Layout';
import { GetServerSideProps } from 'next';
import { extractAccessToken } from '@/pages/_app';
const LoginPage = () => {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
};

export default LoginPage;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const cookie = context.req.headers.cookie ?? '';
  const access_token = extractAccessToken(cookie);
  if (access_token) {
    return {
      redirect: {
        destination: '/',
      },
      props: {},
    };
  }
  return {
    props: {},
  };
};
