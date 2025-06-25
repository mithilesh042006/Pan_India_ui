// Application constants

export const USER_ROLES = {
  EMPLOYEE: 'employee',
  EMPLOYER: 'employer',
};

export const RATING_CONTEXTS = {
  EMPLOYEE_TO_COMPANY: 'EMPLOYEE_TO_COMPANY',
  EMPLOYER_TO_EMPLOYEE: 'EMPLOYER_TO_EMPLOYEE',
};

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

export const RATING_SCALE = {
  1: { label: 'Poor', color: 'red' },
  2: { label: 'Fair', color: 'orange' },
  3: { label: 'Good', color: 'yellow' },
  4: { label: 'Very Good', color: 'blue' },
  5: { label: 'Excellent', color: 'green' },
};

export const CITIES = [
  'Mumbai',
  'Delhi',
  'Bangalore',
  'Chennai',
  'Kolkata',
  'Hyderabad',
  'Pune',
  'Ahmedabad',
  'Jaipur',
  'Lucknow',
  'Kanpur',
  'Nagpur',
  'Indore',
  'Thane',
  'Bhopal',
  'Visakhapatnam',
  'Pimpri-Chinchwad',
  'Patna',
  'Vadodara',
  'Ghaziabad',
];

export const COMMON_SKILLS = [
  // Technical Skills
  'JavaScript',
  'Python',
  'Java',
  'React',
  'Node.js',
  'Angular',
  'Vue.js',
  'Django',
  'Flask',
  'Spring Boot',
  'MySQL',
  'PostgreSQL',
  'MongoDB',
  'AWS',
  'Azure',
  'Docker',
  'Kubernetes',
  'Git',
  'HTML',
  'CSS',
  
  // Soft Skills
  'Communication',
  'Leadership',
  'Team Management',
  'Project Management',
  'Problem Solving',
  'Critical Thinking',
  'Time Management',
  'Adaptability',
  'Creativity',
  'Collaboration',
];

export const PAGINATION = {
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  PAGE_SIZE_OPTIONS: [10, 20, 50, 100],
};

export const LOCAL_STORAGE_KEYS = {
  ACCESS_TOKEN: 'access_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  THEME: 'theme',
};

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
  PROFILE: '/profile',
  COMPANIES: '/companies',
  EMPLOYEES: '/employees',
  RATINGS: '/ratings',
  USER_STATS: '/user-stats',
};

export const API_STATUS = {
  IDLE: 'idle',
  LOADING: 'loading',
  SUCCESS: 'success',
  ERROR: 'error',
};

export const TOAST_TYPES = {
  SUCCESS: 'success',
  ERROR: 'error',
  WARNING: 'warning',
  INFO: 'info',
};
