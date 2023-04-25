import LoginForm from '@/components/LoginForm';
import React from 'react';
import Layout from '@/components/Layout';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';
import { withNotLogin } from '@/hoc/withNotLogin';
const LoginPage = () => {
  return (
    <Layout>
      <LoginForm />
    </Layout>
  );
};

export default withNotLogin(LoginPage);

// export const getServerSideProps: GetServerSideProps = withLogin((context) => {
//   console.log('withLogin');
//   return {
//     props: {},
//   };
// });
