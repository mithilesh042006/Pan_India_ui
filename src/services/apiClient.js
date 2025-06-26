import axios from 'axios';
import { API_CONFIG, HTTP_STATUS } from '../config/api';
import toast from 'react-hot-toast';

// Create axios instance
const apiClient = axios.create({
  baseURL: API_CONFIG.BASE_URL,
  timeout: API_CONFIG.TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token management
const getToken = () => localStorage.getItem('access_token');
const getRefreshToken = () => localStorage.getItem('refresh_token');
const setTokens = (accessToken, refreshToken) => {
  localStorage.setItem('access_token', accessToken);
  if (refreshToken) {
    localStorage.setItem('refresh_token', refreshToken);
  }
};
const clearTokens = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('refresh_token');
  localStorage.removeItem('user');
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for token refresh and error handling
apiClient.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // Handle token refresh
    if (error.response?.status === HTTP_STATUS.UNAUTHORIZED && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = getRefreshToken();
      if (refreshToken) {
        try {
          const response = await axios.post(
            `${API_CONFIG.BASE_URL}${API_CONFIG.ENDPOINTS.REFRESH}`,
            { refresh: refreshToken }
          );
          
          const { access } = response.data;
          setTokens(access);
          
          // Retry original request with new token
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          // Refresh failed, redirect to login
          clearTokens();
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, redirect to login
        clearTokens();
        window.location.href = '/login';
      }
    }

    // Handle different error types
    if (error.response) {
      const { status, data } = error.response;
      
      switch (status) {
        case HTTP_STATUS.BAD_REQUEST:
          // Handle validation errors
          if (data.details) {
            Object.values(data.details).forEach(errors => {
              if (Array.isArray(errors)) {
                errors.forEach(error => toast.error(error));
              }
            });
          } else if (data.error) {
            toast.error(data.error);
          } else if (data.message) {
            toast.error(data.message);
          } else {
            toast.error('Invalid request data. Please check your input and try again.');
          }
          break;
          
        case HTTP_STATUS.UNAUTHORIZED:
          toast.error('Authentication required. Please login.');
          break;
          
        case HTTP_STATUS.FORBIDDEN:
          toast.error('Access denied. You don\'t have permission for this action.');
          break;
          
        case HTTP_STATUS.NOT_FOUND:
          toast.error('Resource not found.');
          break;
          
        case HTTP_STATUS.TOO_MANY_REQUESTS:
          toast.error('Too many requests. Please try again later.');
          break;
          
        case HTTP_STATUS.INTERNAL_SERVER_ERROR:
          toast.error('Server error. Please try again later.');
          break;
          
        default:
          toast.error('An unexpected error occurred.');
      }
    } else if (error.request) {
      // Network error
      toast.error('Network error. Please check your connection.');
    } else {
      // Other error
      toast.error('An unexpected error occurred.');
    }

    return Promise.reject(error);
  }
);

// Helper functions for common request patterns
export const apiHelpers = {
  // GET request with query parameters
  get: (url, params = {}) => {
    return apiClient.get(url, { params });
  },

  // POST request
  post: (url, data = {}) => {
    return apiClient.post(url, data);
  },

  // PUT request
  put: (url, data = {}) => {
    return apiClient.put(url, data);
  },

  // PATCH request
  patch: (url, data = {}) => {
    return apiClient.patch(url, data);
  },

  // DELETE request
  delete: (url) => {
    return apiClient.delete(url);
  },

  // File upload
  upload: (url, formData) => {
    return apiClient.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export { setTokens, clearTokens, getToken, getRefreshToken };
export default apiClient;
