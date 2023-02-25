import { GetServerSidePropsContext } from 'next';

const withNotAuth = (
  gssp: (context: GetServerSidePropsContext) => { props: any },
) => {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context;
    const token = req.cookies.access_token;

    if (!token) {
      return {
        redirect: {
          destination: '/auth/login',
          permanent: false,
        },
      };
    }

    return await gssp(context);
  };
};

export { withNotAuth };
