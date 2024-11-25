import axios from 'axios';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

apiClient.interceptors.request.use(
  (config) => {
    // 예: 토큰을 포함시킬 경우
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.response && error.response.status === 401) {
      // 401 에러 처리 (예: 인증 실패 시)
      console.error('Unauthorized. Redirecting to login.');
      // 예: 로그인 페이지로 리다이렉트
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default {
  get(url: any, params = {}) {
    return apiClient.get(url, { params });
  },
  post(url: any, data: any) {
    return apiClient.post(url, data);
  },
  upload(url: any, data: any) {
    return apiClient.post(url, data, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
  put(url: any, data: any) {
    return apiClient.put(url, data);
  },
  delete(url: any) {
    return apiClient.delete(url);
  },
};
