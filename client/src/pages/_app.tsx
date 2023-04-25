import type { AppContext, AppProps } from 'next/app';
import { Box, Container } from '@mui/material';
import '@/styles/reset.css';
import { TokenRefreshProvider } from '@/lib/token/TokenRefreshContext';
import Core from '@/lib/token/Core';
import { ReactElement } from 'react';
import { decode } from 'js-base64';
import { postRefreshToken } from '@/lib/apis/auth';
import { refreshExpireAt, accessExpireAt } from '@/constants/tokenExpire';
import { useUserStore } from '@/store/user';
import { getMe } from '@/lib/apis/me';
import StoreInitializer from '@/core/StoreInitializer';

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

function setCookie(type: 'access_token' | 'refresh_token') {
  return (token: string) => {
    let expireAt: string = '';
    if (type === 'access_token') {
      expireAt = new Date(Date.now() + accessExpireAt).toUTCString();
    } else if (type === 'refresh_token') {
      expireAt = new Date(Date.now() + refreshExpireAt).toUTCString();
    }
    return `${type}=${token}; path=/; expires=${expireAt}; HttpOnly`;
  };
}

function App({ Component, pageProps }: AppProps): ReactElement {
  return (
    <TokenRefreshProvider>
      <StoreInitializer user={pageProps.user} />
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

App.getInitialProps = async ({ Component, ctx, router }: AppContext) => {
  let pageProps: any = {};
  if (Component.getInitialProps) {
    pageProps = await Component.getInitialProps(ctx);
  }

  pageProps.user = null;
  const Cookie = ctx.req?.headers.cookie;
  // ssr 에서만 동작
  if (Cookie) {
    const access_token = extractAccessToken(Cookie);
    const refresh_token = extractRefreshToken(Cookie);
    if (access_token && refresh_token) {
      pageProps.tokenRemainingTime = getTokenRemainingTime(access_token);
      pageProps.user = await getMe({ access_token });
    } else if (!access_token && refresh_token) {
      try {
        const { accessToken, refreshToken } = await postRefreshToken({
          refresh: refresh_token,
        });
        if (accessToken && refreshToken) {
          pageProps.tokenRemainingTime = getTokenRemainingTime(accessToken);
          pageProps.user = await getMe({ access_token: accessToken });
          const accessCookie = setCookie('access_token');
          const refreshCookie = setCookie('refresh_token');
          ctx.res?.setHeader('Set-Cookie', [
            accessCookie(accessToken),
            refreshCookie(refreshToken),
          ]);
          if (accessToken && router.pathname === '/auth/login') {
            ctx.res?.writeHead(302, { Location: '/' });
            ctx.res?.end();
          }
        }
      } catch (e) {
        console.error(e);
      }
    } else if (!access_token && !refresh_token) {
      if (router.pathname !== '/auth/login') {
        ctx.res?.writeHead(302, { Location: '/auth/login' });
        ctx.res?.end();
      }
    }
  }
  return { pageProps };
};

export default App;
