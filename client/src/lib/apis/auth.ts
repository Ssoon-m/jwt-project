import api from '.';

export interface IUser {
  userId: number;
  username: string;
  password: string;
}

const postAuthLogin = async (user: Omit<IUser, 'userId'>) => {
  return await api
    .post('/auth/login', user, { withCredentials: true })
    .then((res) => res.data);
};

const postUser = async (user: Omit<IUser, 'userId'>) => {
  return await api
    .post('/users', user, { withCredentials: true })
    .then((res) => res.data);
};

const postRefreshToken = async ({ refresh }: { refresh?: string } = {}) => {
  return await api
    .post<{ accessToken: string; refreshToken: string }>(
      '/auth/refresh',
      { refresh },
      { withCredentials: true },
    )
    .then((res) => res.data);
};

const postAdmin = async (userId: IUser['userId']) => {
  return await api.post('/auth/admin', { userId });
};

export { postAuthLogin, postUser, postRefreshToken, postAdmin };
