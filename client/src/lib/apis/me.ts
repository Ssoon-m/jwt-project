import api from '.';
import { IUser } from './auth';

const getMe = async ({ access_token }: { access_token?: string } = {}) => {
  return await api
    .get<Omit<IUser, 'password'>>('/auth/me', {
      ...(access_token && {
        headers: {
          Authorization: `Bearer ${access_token}`,
        },
      }),
      withCredentials: true,
    })
    .then((res) => res.data);
};

export { getMe };
