import axios from 'axios';
import { cleanParams } from '@/utils/common';
import { BASE_URL } from '@/configurations/environment';
import { showErrorMessage, showMessage } from '@/utils/alert';

const instance = axios.create({
  baseURL: BASE_URL || undefined,
  withCredentials: false,
});

instance.interceptors.request.use(
  (config) => {
    console.log('=== DEBUG: Request ===');
    console.log('URL:', config.url);
    console.log('Method:', config.method);
    console.log('Params:', config.params);
    console.log('=======================');
    if (config.params) {
      config.params = cleanParams(config.params);
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// instance.interceptors.response.use(
// 	response => response,
// 	error => {
// 		if (error?.response?.status <= 499 && error?.response?.status !== 401 && error?.response?.status !== 404) {
// 			showErrorMessage(error)
// 		} else if (error?.response?.status >= 500) {
// 			showMessage('Internal server error', 'error', 15000)
// 		}
// 		return Promise.reject(error)
// 	}
// )

instance.interceptors.response.use(
  (response) => {
    console.log('=== DEBUG: Response ===');
    console.log('URL:', response.config.url);
    console.log('Status:', response.status);
    console.log('Data:', response.data);
    console.log('=======================');
    return response;
  },
  (error) => {
    console.log('=== DEBUG: Response Error ===');
    console.log('URL:', error?.config?.url);
    console.log('Status:', error?.response?.status);
    console.log('Error:', error?.response?.data || error?.message);
    console.log('===========================');
    if (
      error?.response?.status <= 499 &&
      error?.response?.status !== 401 &&
      error?.response?.status !== 404
    ) {
      showErrorMessage(error);
    } else if (error?.response?.status >= 500) {
      showMessage('Internal server error', 'error', 15000);
    } else if (error?.response?.status === 401 && error?.response?.config?.url === 'users/me') {
      showMessage('Invalid or missing authentication token', 'alert', 15000);
    } else if (error?.response?.status === 401 && error?.response?.config?.url === 'auth/login') {
      showMessage('Invalid username or password', 'error', 15000);
    } else if (error?.response?.status === 404) {
      showMessage('API not found', 'error', 15000);
    }
    return Promise.reject(error);
  }
);

export default instance;
