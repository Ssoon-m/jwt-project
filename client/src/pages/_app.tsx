import type { AppProps } from 'next/app';
import { Box, Container } from '@mui/material';
import '@/styles/reset.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container maxWidth="sm">
      <Box
        sx={{
          minHeight: '100vh',
          display: 'flex',
          flexDirection: 'column',
        }}
      >
        <Component {...pageProps} />
      </Box>
    </Container>
  );
}
