import { apiHelpers } from './apiClient';
import { API_CONFIG } from '../config/api';
import { setTokens, clearTokens } from './apiClient';

class AuthService {
  // User registration
  async register(userData) {
    const response = await apiHelpers.post(API_CONFIG.ENDPOINTS.REGISTER, userData);
    return response.data;
  }

  // User login
  async login(credentials) {
    const response = await apiHelpers.post(API_CONFIG.ENDPOINTS.LOGIN, credentials);
    const { access, refresh, user } = response.data;
    
    // Store tokens and user data
    setTokens(access, refresh);
    localStorage.setItem('user', JSON.stringify(user));
    
    return response.data;
  }

  // User logout
  logout() {
    clearTokens();
    window.location.href = '/login';
  }

  // Get user profile
  async getProfile() {
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.PROFILE);
    return response.data;
  }

  // Update user profile
  async updateProfile(profileData) {
    const response = await apiHelpers.patch(API_CONFIG.ENDPOINTS.PROFILE, profileData);
    
    // Update stored user data
    const updatedUser = response.data;
    localStorage.setItem('user', JSON.stringify(updatedUser));
    
    return updatedUser;
  }

  // Change password
  async changePassword(passwordData) {
    const response = await apiHelpers.put(API_CONFIG.ENDPOINTS.CHANGE_PASSWORD, passwordData);
    return response.data;
  }

  // Request password reset
  async requestPasswordReset(email) {
    const response = await apiHelpers.post(API_CONFIG.ENDPOINTS.PASSWORD_RESET_REQUEST, { email });
    return response.data;
  }

  // Confirm password reset
  async confirmPasswordReset(resetData) {
    const response = await apiHelpers.post(API_CONFIG.ENDPOINTS.PASSWORD_RESET_CONFIRM, resetData);
    return response.data;
  }

  // Upload avatar
  async uploadAvatar(file) {
    const formData = new FormData();
    formData.append('avatar', file);
    
    const response = await apiHelpers.upload(API_CONFIG.ENDPOINTS.AVATAR_UPLOAD, formData);
    return response.data;
  }

  // Check email availability
  async checkEmailAvailability(email) {
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.CHECK_EMAIL, { email });
    return response.data;
  }

  // Get authentication status
  async getAuthStatus() {
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.AUTH_STATUS);
    return response.data;
  }

  // Get user statistics
  async getUserStatistics() {
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.STATISTICS);
    return response.data;
  }

  // Get current user from localStorage
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  // Check if user is authenticated
  isAuthenticated() {
    const token = localStorage.getItem('access_token');
    const user = this.getCurrentUser();
    return !!(token && user);
  }

  // Check if user has specific role
  hasRole(role) {
    const user = this.getCurrentUser();
    return user?.user_role === role;
  }
}

export default new AuthService();
