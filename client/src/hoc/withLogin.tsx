import { GetServerSidePropsContext } from 'next';
import cookies from 'next-cookies';

const withLogin = (
  gssp: (context: GetServerSidePropsContext) => { props: any },
) => {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context;
    const { token } = cookies(context);
    // if (token) {
    //   return {
    //     redirect: {
    //       destination: '/',
    //       permanent: false,
    //     },
    //   };
    // }

    return await gssp(context);
  };
};

export { withLogin };
