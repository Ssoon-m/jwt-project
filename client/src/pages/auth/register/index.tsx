import React from 'react';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/RegisterForm';
import { GetServerSideProps } from 'next';
import { extractAccessToken } from '@/pages/_app';
const RegisterPage = () => {
  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
};

export default RegisterPage;

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
