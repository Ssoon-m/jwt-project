import React from 'react';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/RegisterForm';
import { getCookie } from 'cookies-next';
import { GetServerSideProps } from 'next';
import { withNotLogin } from '@/hoc/withNotLogin';
const RegisterPage = () => {
  return (
    <Layout>
      <RegisterForm />
    </Layout>
  );
};

export default withNotLogin(RegisterPage);
