import { useUserStore } from '@/store/user';
import { useRouter } from 'next/router';
import React, { useEffect } from 'react';

export function withLogin(Component: React.ComponentType) {
  return function OnlyLoginPage(props: any) {
    const user = useUserStore((state) => state.user);
    const router = useRouter();
    useEffect(() => {
      if (user) return;
      if (!user) router.replace('/auth/login');
    }, [user]);

    if (!user) return <div></div>;

    return (
      <React.Fragment>
        <Component {...props}></Component>
      </React.Fragment>
    );
  };
}
