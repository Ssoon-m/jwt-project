import Head from 'next/head';
import { Button, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import { Box } from '@mui/system';
import Layout from '@/components/Layout';
import { getMe } from '@/lib/apis/me';
import { useState } from 'react';
import { GetServerSideProps, GetServerSidePropsContext } from 'next';
import { getCookie } from 'cookies-next';
import { withNotAuth } from '../hoc/withNotAuth';

//TODO: 토큰 refresh 로직 구현
const Home = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');

  const handleGetMe = async () => {
    try {
      const { username } = await getMe();
      setUsername(username);
    } catch (e: any) {
      alert(e.response.data.message);
    }
  };

  return (
    <>
      <Head>
        <title>jwt-project</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main style={{ height: '100%' }}>
        <Layout>
          <Box>
            <Button color="inherit" onClick={() => router.push('/auth/login')}>
              로그인
            </Button>
            <Button
              color="secondary"
              variant="contained"
              disableElevation
              onClick={() => router.push('/auth/register')}
            >
              회원가입
            </Button>
          </Box>
          <Box>
            <Button onClick={handleGetMe}>회원정보 가져오기</Button>
            <Typography>{username}</Typography>
          </Box>
        </Layout>
      </main>
    </>
  );
};

export default Home;

export const getServerSideProps: GetServerSideProps = withNotAuth((context) => {
  return {
    props: {},
  };
});
