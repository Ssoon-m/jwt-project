import type { AppContext, AppProps } from 'next/app';
import { Box, Container } from '@mui/material';
import '@/styles/reset.css';
import { TokenRefreshProvider } from '@/lib/token/TokenRefreshContext';
import Core from '@/lib/token/Core';
import { ReactElement } from 'react';
import { decode } from 'js-base64';
import { postRefreshToken } from '@/lib/apis/auth';

function extractAccessToken(cookie: string) {
  const match = cookie.match(/access_token=([^;]+)/);
  return match ? match[1] : null;
}

function extractRefreshToken(cookie: string) {
  const match = cookie.match(/refresh_token=([^;]+)/);
  return match ? match[1] : null;
}

function getTokenRemainingTime(token: string) {
  const decoded = decode(token.split('.')[1]);
  const { exp } = JSON.parse(decoded);
  return exp * 1000 - Date.now();
}

function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    // <TokenRefreshProvider>
    <Container maxWidth="xs" sx={{ height: '100%' }}>
      <Box
        sx={{
          height: '100%',
        }}
      >
        <Component {...pageProps} />
      </Box>
    </Container>
    // <Core remainingTime={pageProps.tokenRemainingTime} />
    // </TokenRefreshProvider>
  );
}

// auth/login 진입 시
// 1.getInitialProps
// 2.request
// 3.response
// 4.withLogin

// root page 진입 시
// 1.getInitialProps
// 2.request
// 3.response
// 4.getInitialProps
// 5.getInitialProps
// 6.withNotAuth

App.getInitialProps = async ({ Component, ctx }: AppContext) => {
  let pageProps: any = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }
  console.log('getInitialProps');

  const Cookie = ctx.req?.headers.cookie;

  if (Cookie) {
    const access_token = extractAccessToken(Cookie);
    const refresh_token = extractRefreshToken(Cookie);
    if (access_token) {
      pageProps.tokenRemainingTime = getTokenRemainingTime(access_token);
    } else if (!access_token && refresh_token) {
      try {
        const { accessToken, refreshToken } = await postRefreshToken({
          refresh: refresh_token,
        });
        pageProps.tokenRemainingTime = getTokenRemainingTime(accessToken);
        ctx.res?.setHeader('Set-Cookie', [
          `access_token=${accessToken}; path=/; expires=${new Date(
            Date.now() + 1000 * 30,
          )}; HttpOnly`,
          `refresh_token=${refreshToken}; path=/; expires=${new Date(
            Date.now() + 1000 * 60 * 60 * 24,
          )}; HttpOnly`,
        ]);
      } catch (e) {
        console.error(e);
      }
    }
  }

  return { pageProps };
};

export default App;
