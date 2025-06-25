// Helper utility functions

/**
 * Format date to readable string
 * @param {string|Date} date - Date to format
 * @param {object} options - Intl.DateTimeFormat options
 * @returns {string} Formatted date string
 */
export const formatDate = (date, options = {}) => {
  if (!date) return '';
  
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  };
  
  return new Intl.DateTimeFormat('en-US', { ...defaultOptions, ...options }).format(new Date(date));
};

/**
 * Format date to relative time (e.g., "2 days ago")
 * @param {string|Date} date - Date to format
 * @returns {string} Relative time string
 */
export const formatRelativeTime = (date) => {
  if (!date) return '';
  
  const now = new Date();
  const targetDate = new Date(date);
  const diffInSeconds = Math.floor((now - targetDate) / 1000);
  
  const intervals = [
    { label: 'year', seconds: 31536000 },
    { label: 'month', seconds: 2592000 },
    { label: 'week', seconds: 604800 },
    { label: 'day', seconds: 86400 },
    { label: 'hour', seconds: 3600 },
    { label: 'minute', seconds: 60 },
  ];
  
  for (const interval of intervals) {
    const count = Math.floor(diffInSeconds / interval.seconds);
    if (count >= 1) {
      return `${count} ${interval.label}${count > 1 ? 's' : ''} ago`;
    }
  }
  
  return 'Just now';
};

/**
 * Calculate average rating from an array of ratings
 * @param {Array} ratings - Array of rating objects
 * @param {string} scoreField - Field name containing the score
 * @returns {number} Average rating
 */
export const calculateAverageRating = (ratings, scoreField = 'score') => {
  if (!ratings || ratings.length === 0) return 0;
  
  const total = ratings.reduce((sum, rating) => sum + (rating[scoreField] || 0), 0);
  return Math.round((total / ratings.length) * 10) / 10; // Round to 1 decimal place
};

/**
 * Get rating color based on score
 * @param {number} rating - Rating score (1-5)
 * @returns {string} Tailwind color class
 */
export const getRatingColor = (rating) => {
  if (rating >= 4.5) return 'text-green-600';
  if (rating >= 3.5) return 'text-blue-600';
  if (rating >= 2.5) return 'text-yellow-600';
  if (rating >= 1.5) return 'text-orange-600';
  return 'text-red-600';
};

/**
 * Get rating background color based on score
 * @param {number} rating - Rating score (1-5)
 * @returns {string} Tailwind background color class
 */
export const getRatingBgColor = (rating) => {
  if (rating >= 4.5) return 'bg-green-100';
  if (rating >= 3.5) return 'bg-blue-100';
  if (rating >= 2.5) return 'bg-yellow-100';
  if (rating >= 1.5) return 'bg-orange-100';
  return 'bg-red-100';
};

/**
 * Truncate text to specified length
 * @param {string} text - Text to truncate
 * @param {number} maxLength - Maximum length
 * @returns {string} Truncated text
 */
export const truncateText = (text, maxLength = 100) => {
  if (!text || text.length <= maxLength) return text;
  return text.substring(0, maxLength).trim() + '...';
};

/**
 * Capitalize first letter of each word
 * @param {string} str - String to capitalize
 * @returns {string} Capitalized string
 */
export const capitalizeWords = (str) => {
  if (!str) return '';
  return str.replace(/\b\w/g, (char) => char.toUpperCase());
};

/**
 * Generate initials from full name
 * @param {string} name - Full name
 * @returns {string} Initials
 */
export const getInitials = (name) => {
  if (!name) return '';
  return name
    .split(' ')
    .map(word => word.charAt(0).toUpperCase())
    .slice(0, 2)
    .join('');
};

/**
 * Debounce function
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in milliseconds
 * @returns {Function} Debounced function
 */
export const debounce = (func, wait) => {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
};

/**
 * Check if email is valid
 * @param {string} email - Email to validate
 * @returns {boolean} Is valid email
 */
export const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * Generate random color for avatar
 * @param {string} seed - Seed for consistent color generation
 * @returns {string} Tailwind background color class
 */
export const getAvatarColor = (seed) => {
  const colors = [
    'bg-red-500',
    'bg-blue-500',
    'bg-green-500',
    'bg-yellow-500',
    'bg-purple-500',
    'bg-pink-500',
    'bg-indigo-500',
    'bg-teal-500',
  ];
  
  let hash = 0;
  for (let i = 0; i < seed.length; i++) {
    hash = seed.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  return colors[Math.abs(hash) % colors.length];
};

/**
 * Format number with commas
 * @param {number} num - Number to format
 * @returns {string} Formatted number
 */
export const formatNumber = (num) => {
  if (typeof num !== 'number') return '0';
  return num.toLocaleString();
};

/**
 * Check if user can rate another user
 * @param {object} currentUser - Current user object
 * @param {object} targetUser - Target user object
 * @returns {boolean} Can rate
 */
export const canRate = (currentUser, targetUser) => {
  if (!currentUser || !targetUser) return false;
  if (currentUser.id === targetUser.id) return false;
  
  // Employee can rate employers, employer can rate employees
  return (
    (currentUser.user_role === 'employee' && targetUser.user_role === 'employer') ||
    (currentUser.user_role === 'employer' && targetUser.user_role === 'employee')
  );
};
