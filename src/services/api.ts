import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig } from 'axios';
import { clearTokens, getAccessToken, getRefreshToken, setAccessToken } from './tokenManager';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL || 'https://staging.bayzati.com/api/v1';

/**
 * Create axios instance with default configuration
 */
const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 10000, // 10 seconds
});

/**
 * Flag to prevent multiple simultaneous refresh attempts
 */
let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token: string) => void;
  reject: (error: any) => void;
}> = [];

/**
 * Process queued requests after token refresh
 */
const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((promise) => {
    if (error) {
      promise.reject(error);
    } else if (token) {
      promise.resolve(token);
    }
  });

  failedQueue = [];
};

/**
 * Request interceptor to inject access token
 */
apiClient.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await getAccessToken();

     if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/**
 * Response interceptor to handle token refresh on 401
 */
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // If error is 401 and we haven't retried yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If already refreshing, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${token}`;
            }
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const refreshToken = await getRefreshToken();

        if (!refreshToken) {
          // No refresh token available, user needs to login
          await clearTokens();
          processQueue(new Error('No refresh token available'), null);
          return Promise.reject(error);
        }

        // Attempt to refresh the token
        const response = await axios.post(`${API_BASE_URL}/auth/token/refresh/`, {
          refresh: refreshToken,
        });

        const { access } = response.data;

        // Store the new access token
        await setAccessToken(access);

        // Update the failed request with new token
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${access}`;
        }

        // Process any queued requests
        processQueue(null, access);

        // Retry the original request
        return apiClient(originalRequest);
      } catch (refreshError) {
        // Refresh token is invalid, clear all tokens
        await clearTokens();
        processQueue(refreshError, null);
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default apiClient;
export { API_BASE_URL };
