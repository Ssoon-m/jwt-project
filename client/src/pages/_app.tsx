import type { AppProps } from 'next/app';
import { Box, Container } from '@mui/material';
import '@/styles/reset.css';
import { TokenRefreshProvider } from '@/lib/token/TokenRefreshContext';
import Core from '@/lib/token/Core';
export default function App({ Component, pageProps }: AppProps) {
  return (
    <TokenRefreshProvider>
      <Container maxWidth="xs">
        <Box
          sx={{
            height: '100vh',
          }}
        >
          <Component {...pageProps} />
        </Box>
      </Container>
      <Core />
    </TokenRefreshProvider>
  );
}
