import { apiHelpers } from './apiClient';
import { API_CONFIG } from '../config/api';

class RatingService {
  // Create a new rating
  async createRating(ratingData) {
    const response = await apiHelpers.post(API_CONFIG.ENDPOINTS.RATINGS, ratingData);
    return response.data;
  }

  // Get rating categories
  async getRatingCategories(roleContext = null) {
    const params = roleContext ? { role_context: roleContext } : {};
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.RATING_CATEGORIES, params);
    return response.data;
  }

  // Check rating eligibility
  async checkRatingEligibility(rateeId, roleContext) {
    const response = await apiHelpers.post(API_CONFIG.ENDPOINTS.CHECK_RATING_ELIGIBILITY, {
      ratee_id: rateeId,
      role_context: roleContext,
    });
    return response.data;
  }

  // Get ratings given by current user
  async getMyRatingsGiven(params = {}) {
    const { page = 1, page_size = API_CONFIG.DEFAULT_PAGE_SIZE } = params;
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.MY_RATINGS_GIVEN, {
      page,
      page_size,
    });
    return response.data;
  }

  // Get ratings received by current user
  async getMyRatingsReceived(params = {}) {
    const { page = 1, page_size = API_CONFIG.DEFAULT_PAGE_SIZE } = params;
    const response = await apiHelpers.get(API_CONFIG.ENDPOINTS.MY_RATINGS_RECEIVED, {
      page,
      page_size,
    });
    return response.data;
  }

  // Calculate average rating from category scores
  calculateAverageRating(categoryScores) {
    if (!categoryScores || categoryScores.length === 0) return 0;
    
    const total = categoryScores.reduce((sum, item) => sum + item.score, 0);
    return (total / categoryScores.length).toFixed(1);
  }

  // Validate rating data
  validateRatingData(ratingData) {
    const { ratee, role_context, category_scores } = ratingData;
    
    if (!ratee) {
      throw new Error('Ratee is required');
    }
    
    if (!role_context) {
      throw new Error('Role context is required');
    }
    
    if (!category_scores || category_scores.length === 0) {
      throw new Error('Category scores are required');
    }
    
    // Validate each category score
    category_scores.forEach((item, index) => {
      if (!item.category) {
        throw new Error(`Category is required for score ${index + 1}`);
      }
      
      if (!item.score || item.score < 1 || item.score > 5) {
        throw new Error(`Score must be between 1 and 5 for ${item.category}`);
      }
    });
    
    return true;
  }

  // Format rating data for display
  formatRatingForDisplay(rating) {
    return {
      ...rating,
      created_at: new Date(rating.created_at).toLocaleDateString(),
      average_score: this.calculateAverageRating(rating.category_scores),
    };
  }

  // Get rating context based on user roles
  getRatingContext(raterRole, rateeRole) {
    if (raterRole === 'employee' && rateeRole === 'employer') {
      return 'EMPLOYEE_TO_COMPANY';
    } else if (raterRole === 'employer' && rateeRole === 'employee') {
      return 'EMPLOYER_TO_EMPLOYEE';
    }
    throw new Error('Invalid rating context');
  }
}

export default new RatingService();
