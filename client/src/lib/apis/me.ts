import api from '.';
import { IUser } from './auth';

const getMe = async () => {
  return await api
    .get<Omit<IUser, 'password'>>('/auth/me', {
      withCredentials: true,
    })
    .then((res) => res.data);
};

export { getMe };
