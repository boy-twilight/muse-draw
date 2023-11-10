import axios, { AxiosInstance } from 'axios';
import { ls } from '@/utils';

const request: AxiosInstance = axios.create({
  timeout: 10000,
  baseURL: import.meta.env.API_BASE_URL,
});

// 添加请求拦截器
request.interceptors.request.use(
  (config) => {
    // 如果存在token，请求头携带token
    const token = ls.get('token');
    if (token) {
      config.headers.Authorization = `${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 添加响应拦截器
request.interceptors.response.use(
  (response) => {
    if (response.status != 200 && response.status != 201) {
      return Promise.reject(response);
    } else {
      return response.data;
    }
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default request;
