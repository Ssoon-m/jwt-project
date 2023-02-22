import type { AppProps } from 'next/app';

export default function App({ Component, pageProps }: AppProps) {
  return (
    <div style={{ display: 'flex', justifyContent: 'center' }}>
      <Component {...pageProps} />
    </div>
  );
}
