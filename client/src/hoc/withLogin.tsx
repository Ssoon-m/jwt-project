import { GetServerSidePropsContext } from 'next';

const withLogin = (
  gssp: (context: GetServerSidePropsContext) => { props: any },
) => {
  return async (context: GetServerSidePropsContext) => {
    const { req } = context;
    const token = req.cookies.access_token;

    if (token) {
      return {
        redirect: {
          destination: '/',
          permanent: false,
        },
      };
    }

    return await gssp(context);
  };
};

export { withLogin };
