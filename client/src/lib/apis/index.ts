import axios from 'axios';
import { getCookie } from 'cookies-next';
import { postRefreshToken } from './auth';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL,
});

// api.interceptors.response.use(
//   (response: any) => {
//     return response;
//   },
//   async function (err) {
//     const originalConfig = err.config;
//     if (
//       err.response &&
//       err.response.data.statusCode === 401 &&
//       !originalConfig.__retry &&
//       (err.response.data.message === 'token expired error' ||
//         err.response.data.message === 'not exist access_token')
//     ) {
//       try {
//         originalConfig.__retry = true;
//         await postRefreshToken();

//         return api.request(originalConfig);
//       } catch (e: any) {
//         return Promise.reject(err);
//       }
//     }

//     return Promise.reject(err);
//   },
// );

export default api;
