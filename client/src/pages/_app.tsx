import type { AppProps } from 'next/app';
import { Box, Container } from '@mui/material';
import '@/styles/reset.css';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <Container maxWidth="xs">
      <Box
        sx={{
          height: '100vh',
        }}
      >
        <Component {...pageProps} />
      </Box>
    </Container>
  );
}
