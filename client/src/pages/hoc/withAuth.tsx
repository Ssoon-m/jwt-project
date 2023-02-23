import { getCookie } from 'cookies-next';
import { useRouter } from 'next/router';
import React from 'react';

// NOTE: hoc에서 ssr시 브라우저 요청 객체를 어떻게 가져올까
const withAuth = (WrapperComponent: React.ComponentType) => {
  const Component = (props: any) => {
    const router = useRouter();
    const accessToken = getCookie('access_token');
    console.log('accessToken', accessToken);
    console.log('window', typeof window);

    return <WrapperComponent {...props} />;
  };
  return Component;
};

export { withAuth };
