import { GetServerSidePropsContext } from 'next';

const withNotLogin = (
  gssp: (context: GetServerSidePropsContext) => { props: any },
) => {
  // return async (context: GetServerSidePropsContext) => {
  //   const { req } = context;
  //   const token = req.cookies.access_token;
  //   console.log('withNotLogin token', token);
  //   if (!token) {
  //     return {
  //       redirect: {
  //         destination: '/auth/login',
  //         permanent: false,
  //       },
  //     };
  //   }
  //   return await gssp(context);
  // };
};

export { withNotLogin };
