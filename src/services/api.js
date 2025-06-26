// API Configuration and Base Service
const API_BASE_URL = 'http://localhost:8000';

class ApiService {
  constructor() {
    this.baseURL = API_BASE_URL;
    this.token = localStorage.getItem('access_token');
  }

  // Set authentication token
  setToken(token) {
    this.token = token;
    if (token) {
      localStorage.setItem('access_token', token);
    } else {
      localStorage.removeItem('access_token');
    }
  }

  // Get authentication headers
  getHeaders(contentType = 'application/json') {
    const headers = {
      'Content-Type': contentType,
    };

    if (this.token) {
      headers['Authorization'] = `Bearer ${this.token}`;
    }

    return headers;
  }

  // Generic request method
  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: this.getHeaders(options.contentType),
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // Handle different response types
      if (response.status === 204) {
        return { success: true };
      }

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.detail || data.error || 'Request failed');
      }

      return data;
    } catch (error) {
      console.error('API Request Error:', error);
      throw error;
    }
  }

  // GET request
  async get(endpoint, params = {}) {
    const queryString = new URLSearchParams(params).toString();
    const url = queryString ? `${endpoint}?${queryString}` : endpoint;
    
    return this.request(url, {
      method: 'GET',
    });
  }

  // POST request
  async post(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  // PATCH request
  async patch(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  // PUT request
  async put(endpoint, data = {}) {
    return this.request(endpoint, {
      method: 'PUT',
      body: JSON.stringify(data),
    });
  }

  // DELETE request
  async delete(endpoint) {
    return this.request(endpoint, {
      method: 'DELETE',
    });
  }

  // File upload request
  async uploadFile(endpoint, formData) {
    return this.request(endpoint, {
      method: 'POST',
      body: formData,
      contentType: undefined, // Let browser set content-type for FormData
    });
  }
}

// Create singleton instance
const apiService = new ApiService();

// Authentication API
export const authAPI = {
  // User registration
  register: (userData) => apiService.post('/api/auth/register/', userData),

  // User login
  login: (credentials) => apiService.post('/api/auth/login/', credentials),

  // Token refresh
  refreshToken: (refreshToken) => apiService.post('/api/auth/refresh/', { refresh: refreshToken }),

  // Get user profile
  getProfile: () => apiService.get('/api/auth/profile/'),

  // Update user profile
  updateProfile: (profileData) => apiService.patch('/api/auth/profile/', profileData),

  // Change password
  changePassword: (passwordData) => apiService.put('/api/auth/change-password/', passwordData),

  // Password reset request
  requestPasswordReset: (email) => apiService.post('/api/auth/password-reset/request/', { email }),

  // Password reset confirm
  confirmPasswordReset: (resetData) => apiService.post('/api/auth/password-reset/confirm/', resetData),

  // Upload avatar
  uploadAvatar: (avatarFile) => {
    const formData = new FormData();
    formData.append('avatar', avatarFile);
    return apiService.uploadFile('/api/auth/avatar/upload/', formData);
  },

  // Check email availability
  checkEmailAvailability: (email) => apiService.get('/api/auth/check-email/', { email }),

  // Get authentication status
  getAuthStatus: () => apiService.get('/api/auth/status/'),

  // Get user statistics
  getUserStatistics: () => apiService.get('/api/auth/statistics/'),
};

// Core Rating System API
export const coreAPI = {
  // Get companies (for employees)
  getCompanies: (params = {}) => apiService.get('/api/core/companies/', params),

  // Get employees (for employers)
  getEmployees: (params = {}) => apiService.get('/api/core/employees/', params),

  // Create rating
  createRating: (ratingData) => apiService.post('/api/core/ratings/', ratingData),

  // Get rating categories
  getRatingCategories: (roleContext) => apiService.get('/api/core/rating-categories/', { role_context: roleContext }),

  // Check rating eligibility
  checkRatingEligibility: (eligibilityData) => apiService.post('/api/core/check-rating-eligibility/', eligibilityData),

  // Get user statistics
  getUserStats: (userId) => apiService.get(`/api/core/users/${userId}/stats/`),

  // Get complete user profile with ratings
  getUserProfile: (userId) => apiService.get(`/api/core/users/${userId}/profile/`),

  // Get dashboard statistics
  getDashboard: () => apiService.get('/api/core/dashboard/'),

  // Get my ratings given
  getMyRatingsGiven: (params = {}) => apiService.get('/api/core/my-ratings/given/', params),

  // Get my ratings received
  getMyRatingsReceived: (params = {}) => apiService.get('/api/core/my-ratings/received/', params),

  // Health check
  healthCheck: () => apiService.get('/api/core/health/'),
};

// Token management utilities
export const tokenManager = {
  // Get stored tokens
  getTokens: () => ({
    access: localStorage.getItem('access_token'),
    refresh: localStorage.getItem('refresh_token'),
  }),

  // Set tokens
  setTokens: (tokens) => {
    if (tokens.access) {
      localStorage.setItem('access_token', tokens.access);
      apiService.setToken(tokens.access);
    }
    if (tokens.refresh) {
      localStorage.setItem('refresh_token', tokens.refresh);
    }
  },

  // Clear tokens
  clearTokens: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    apiService.setToken(null);
  },

  // Check if user is authenticated
  isAuthenticated: () => {
    const token = localStorage.getItem('access_token');
    return !!token;
  },

  // Auto refresh token if needed
  autoRefreshToken: async () => {
    const refreshToken = localStorage.getItem('refresh_token');
    if (!refreshToken) {
      throw new Error('No refresh token available');
    }

    try {
      const response = await authAPI.refreshToken(refreshToken);
      tokenManager.setTokens({ access: response.access });
      return response.access;
    } catch (error) {
      tokenManager.clearTokens();
      throw error;
    }
  },
};

// Request interceptor for automatic token refresh
const originalRequest = apiService.request.bind(apiService);
apiService.request = async function(endpoint, options = {}) {
  try {
    return await originalRequest(endpoint, options);
  } catch (error) {
    // If token expired, try to refresh
    if (error.message.includes('401') || error.message.includes('Unauthorized')) {
      try {
        await tokenManager.autoRefreshToken();
        // Retry the original request with new token
        return await originalRequest(endpoint, {
          ...options,
          headers: this.getHeaders(options.contentType),
        });
      } catch (refreshError) {
        // Refresh failed, redirect to login
        tokenManager.clearTokens();
        window.location.href = '/login';
        throw refreshError;
      }
    }
    throw error;
  }
};

export default apiService;
