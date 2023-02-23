import React from 'react';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/RegisterForm';
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
const RegisterPage = () => {
  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
};

export default RegisterPage;

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
