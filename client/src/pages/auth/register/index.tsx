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
    alert('로그인 상태 이므로 회원가입 페이지 안 가짐');
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
