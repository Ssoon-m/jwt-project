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

const postRefresh = async () => {
  return await api
    .post('auth/refresh', {}, { withCredentials: true })
    .then((res) => res.data);
};

export { postAuthLogin, postUser, postRefresh };
