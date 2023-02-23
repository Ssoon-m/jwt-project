import { Box, Button, TextField, Typography } from '@mui/material';
import React, { useState } from 'react';
import { postUser } from '@/lib/apis/auth';
import { useRouter } from 'next/router';
import Link from 'next/link';
const RegisterForm = () => {
  const router = useRouter();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleUsername = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.currentTarget.value);
  };
  const handlePassword = (e: React.ChangeEvent<HTMLInputElement>) => {
    setPassword(e.currentTarget.value);
  };
  const handleSubmit = async () => {
    try {
      await postUser({
        username,
        password,
      });
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
      <Typography variant="h5">회원가입해주세요~</Typography>
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
        회원가입
      </Button>
      <Typography align="center">
        계정이 이미 있으신가요? <Link href="/auth/login">로그인</Link>
      </Typography>
    </Box>
  );
};

export default RegisterForm;
