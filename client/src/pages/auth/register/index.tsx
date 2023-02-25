import React from 'react';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/RegisterForm';
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { withLogin } from '@/hoc/withLogin';
const RegisterPage = () => {
  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
};

export default RegisterPage;

export const getServerSideProps: GetServerSideProps = withLogin((context) => {
  return {
    props: {},
  };
});
