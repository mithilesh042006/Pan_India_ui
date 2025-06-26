import { apiHelpers } from './apiClient';
import { API_CONFIG } from '../config/api';

class UserService {
  // Get companies (for employees)
  async getCompanies(params = {}) {
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.COMPANIES, params);
    return response.data;
  }

  // Get employees (for employers)
  async getEmployees(params = {}) {
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.EMPLOYEES, params);
    return response.data;
  }

  // Get user statistics
  async getUserStats(userId) {
    const url = API_CONFIG.ENDPOINTS.USER_STATS.replace('{user_id}', userId);
    const response = await apiHelpers.get(url);
    return response.data;
  }

  // Get complete user profile with ratings
  async getUserProfile(userId) {
    const url = API_CONFIG.ENDPOINTS.USER_PROFILE.replace('{user_id}', userId);
    const response = await apiHelpers.get(url);
    return response.data;
  }

  // Get dashboard data
  async getDashboard() {
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.DASHBOARD);
    return response.data;
  }

  // Search users (companies or employees based on current user role)
  async searchUsers(searchParams) {
    const { search, city, skills, min_rating, page = 1, page_size = API_CONFIG.DEFAULT_PAGE_SIZE } = searchParams;
    
    const params = {
      page,
      page_size,
    };

    if (search) params.search = search;
    if (city) params.city = city;
    if (skills) params.skills = skills;
    if (min_rating) params.min_rating = min_rating;

    // Determine endpoint based on user role
    const currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    const endpoint = currentUser.user_role === 'employee' 
      ? API_CONFIG.ENDPOINTS.COMPANIES 
      : API_CONFIG.ENDPOINTS.EMPLOYEES;

    const response = await apiHelpers.get(endpoint, params);
    return response.data;
  }

  // Get health status
  async getHealthStatus() {
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.HEALTH);
    return response.data;
  }
}

export default new UserService();
