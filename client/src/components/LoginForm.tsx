import { Box, Button, TextField, Typography } from '@mui/material';
import { useRouter } from 'next/router';
import React, { useState } from 'react';
import { postAuthLogin } from '@/lib/apis/auth';
import Link from 'next/link';
import { useUserStore } from '@/store/user';
import { getMe } from '@/lib/apis/me';

const LoginForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const setUser = useUserStore((state) => state.setUser);

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };
  const handleSubmit = async () => {
    try {
      await postAuthLogin({
        username,
        password,
      });
      const userInfo = await getMe();
      setUser(userInfo);
      router.push('/');
    } catch (e: any) {
      alert(e.response.data.message);
    }
  };

  return (
    <Box
      sx={{
        width: '100%',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        gap: '12px',
      }}
    >
      <Typography variant="h5">로그인해주세요~</Typography>
      <TextField
        id="outlined-basic"
        label="username"
        variant="outlined"
        onChange={handleUsername}
        fullWidth
      />
      <TextField
        id="outlined-basic"
        type="password"
        label="password"
        variant="outlined"
        onChange={handlePassword}
        fullWidth
      />
      <Button
        sx={{ padding: '15px' }}
        variant="contained"
        disableElevation
        color="secondary"
        fullWidth
        onClick={handleSubmit}
      >
        로그인
      </Button>
      <Typography align="center">
        계정이 없으신가요? <Link href="/auth/register">회원가입</Link>
      </Typography>
    </Box>
  );
};

export default LoginForm;
