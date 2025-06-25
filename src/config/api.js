// API Configuration
export const API_CONFIG = {
  BASE_URL: 'http://localhost:8000',
  ENDPOINTS: {
    // Authentication
    REGISTER: '/api/auth/register/',
    LOGIN: '/api/auth/login/',
    REFRESH: '/api/auth/refresh/',
    PROFILE: '/api/auth/profile/',
    CHANGE_PASSWORD: '/api/auth/change-password/',
    PASSWORD_RESET_REQUEST: '/api/auth/password-reset/request/',
    PASSWORD_RESET_CONFIRM: '/api/auth/password-reset/confirm/',
    AVATAR_UPLOAD: '/api/auth/avatar/upload/',
    CHECK_EMAIL: '/api/auth/check-email/',
    AUTH_STATUS: '/api/auth/status/',
    STATISTICS: '/api/auth/statistics/',
    
    // Core Rating System
    COMPANIES: '/api/core/companies/',
    EMPLOYEES: '/api/core/employees/',
    RATINGS: '/api/core/ratings/',
    RATING_CATEGORIES: '/api/core/rating-categories/',
    CHECK_RATING_ELIGIBILITY: '/api/core/check-rating-eligibility/',
    USER_STATS: '/api/core/users/{user_id}/stats/',
    DASHBOARD: '/api/core/dashboard/',
    MY_RATINGS_GIVEN: '/api/core/my-ratings/given/',
    MY_RATINGS_RECEIVED: '/api/core/my-ratings/received/',
    
    // Utility
    HEALTH: '/api/core/health/',
  },
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // Default pagination
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
};

// HTTP Status Codes
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,
  INTERNAL_SERVER_ERROR: 500,
};

// User Roles
export const USER_ROLES = {
  EMPLOYEE: 'employee',
  EMPLOYER: 'employer',
};

// Rating Contexts
export const RATING_CONTEXTS = {
  EMPLOYEE_TO_COMPANY: 'EMPLOYEE_TO_COMPANY',
  EMPLOYER_TO_EMPLOYEE: 'EMPLOYER_TO_EMPLOYEE',
};

// Rating Categories
export const RATING_CATEGORIES = {
  EMPLOYEE_TO_COMPANY: [
    'Work Environment',
    'Management Quality',
    'Career Growth',
    'Work-Life Balance',
    'Compensation',
    'Company Culture'
  ],
  EMPLOYER_TO_EMPLOYEE: [
    'Technical Skills',
    'Communication',
    'Reliability',
    'Team Collaboration',
    'Problem Solving',
    'Professionalism'
  ]
};
