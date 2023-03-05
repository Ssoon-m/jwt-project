import type { AppContext, AppProps } from 'next/app';
import { Box, Container } from '@mui/material';
import '@/styles/reset.css';
import { TokenRefreshProvider } from '@/lib/token/TokenRefreshContext';
import Core from '@/lib/token/Core';
import { ReactElement } from 'react';
import { decode } from 'js-base64';

function extractAccessToken(cookie: string) {
  const match = cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

function getTokenRemainingTime(token: string) {
  const decoded = decode(token.split('.')[1]);
  const { exp } = JSON.parse(decoded);
  return exp * 1000 - Date.now();
}

function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <TokenRefreshProvider>
      <Container maxWidth="xs" sx={{ height: '100%' }}>
        <Box
          sx={{
            height: '100%',
          }}
        >
          <Component {...pageProps} />
        </Box>
      </Container>
      <Core remainingTime={pageProps.tokenRemainingTime} />
    </TokenRefreshProvider>
  );
}

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps: any = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  const Cookie = ctx.req?.headers.cookie;

  if (Cookie) {
    const access_token = extractAccessToken(Cookie);
    if (access_token) {
      pageProps.tokenRemainingTime = getTokenRemainingTime(access_token);
    }
  }

  return { pageProps };
};

export default App;
