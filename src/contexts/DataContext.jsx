import React, { createContext, useContext, useReducer } from 'react';
import { coreAPI } from '../services/api';

// Initial state
const initialState = {
  // Companies data
  companies: [],
  companiesLoading: false,
  companiesError: null,
  companiesPagination: {
    page: 1,
    pageSize: 20,
    totalCount: 0,
    hasNext: false,
  },

  // Employees data
  employees: [],
  employeesLoading: false,
  employeesError: null,
  employeesPagination: {
    page: 1,
    pageSize: 20,
    totalCount: 0,
    hasNext: false,
  },

  // Ratings data
  ratingsGiven: [],
  ratingsReceived: [],
  ratingsLoading: false,
  ratingsError: null,

  // Dashboard data
  dashboardData: null,
  dashboardLoading: false,
  dashboardError: null,

  // Rating categories
  ratingCategories: null,
  categoriesLoading: false,
  categoriesError: null,

  // User profile data
  userProfiles: {},
  profilesLoading: {},
  profilesError: {},
};

// Action types
const DATA_ACTIONS = {
  // Companies
  SET_COMPANIES_LOADING: 'SET_COMPANIES_LOADING',
  SET_COMPANIES: 'SET_COMPANIES',
  SET_COMPANIES_ERROR: 'SET_COMPANIES_ERROR',
  
  // Employees
  SET_EMPLOYEES_LOADING: 'SET_EMPLOYEES_LOADING',
  SET_EMPLOYEES: 'SET_EMPLOYEES',
  SET_EMPLOYEES_ERROR: 'SET_EMPLOYEES_ERROR',
  
  // Ratings
  SET_RATINGS_LOADING: 'SET_RATINGS_LOADING',
  SET_RATINGS_GIVEN: 'SET_RATINGS_GIVEN',
  SET_RATINGS_RECEIVED: 'SET_RATINGS_RECEIVED',
  SET_RATINGS_ERROR: 'SET_RATINGS_ERROR',
  ADD_RATING: 'ADD_RATING',
  
  // Dashboard
  SET_DASHBOARD_LOADING: 'SET_DASHBOARD_LOADING',
  SET_DASHBOARD_DATA: 'SET_DASHBOARD_DATA',
  SET_DASHBOARD_ERROR: 'SET_DASHBOARD_ERROR',
  
  // Categories
  SET_CATEGORIES_LOADING: 'SET_CATEGORIES_LOADING',
  SET_CATEGORIES: 'SET_CATEGORIES',
  SET_CATEGORIES_ERROR: 'SET_CATEGORIES_ERROR',
  
  // User Profiles
  SET_PROFILE_LOADING: 'SET_PROFILE_LOADING',
  SET_PROFILE: 'SET_PROFILE',
  SET_PROFILE_ERROR: 'SET_PROFILE_ERROR',
  
  // Clear errors
  CLEAR_ERROR: 'CLEAR_ERROR',
};

// Reducer
const dataReducer = (state, action) => {
  switch (action.type) {
    case DATA_ACTIONS.SET_COMPANIES_LOADING:
      return { ...state, companiesLoading: action.payload };
    case DATA_ACTIONS.SET_COMPANIES:
      return {
        ...state,
        companies: action.payload.results,
        companiesPagination: {
          page: action.payload.page,
          pageSize: action.payload.page_size,
          totalCount: action.payload.total_count,
          hasNext: action.payload.has_next,
        },
        companiesLoading: false,
        companiesError: null,
      };
    case DATA_ACTIONS.SET_COMPANIES_ERROR:
      return { ...state, companiesError: action.payload, companiesLoading: false };

    case DATA_ACTIONS.SET_EMPLOYEES_LOADING:
      return { ...state, employeesLoading: action.payload };
    case DATA_ACTIONS.SET_EMPLOYEES:
      return {
        ...state,
        employees: action.payload.results,
        employeesPagination: {
          page: action.payload.page,
          pageSize: action.payload.page_size,
          totalCount: action.payload.total_count,
          hasNext: action.payload.has_next,
        },
        employeesLoading: false,
        employeesError: null,
      };
    case DATA_ACTIONS.SET_EMPLOYEES_ERROR:
      return { ...state, employeesError: action.payload, employeesLoading: false };

    case DATA_ACTIONS.SET_RATINGS_LOADING:
      return { ...state, ratingsLoading: action.payload };
    case DATA_ACTIONS.SET_RATINGS_GIVEN:
      return { ...state, ratingsGiven: action.payload, ratingsLoading: false, ratingsError: null };
    case DATA_ACTIONS.SET_RATINGS_RECEIVED:
      return { ...state, ratingsReceived: action.payload, ratingsLoading: false, ratingsError: null };
    case DATA_ACTIONS.SET_RATINGS_ERROR:
      return { ...state, ratingsError: action.payload, ratingsLoading: false };
    case DATA_ACTIONS.ADD_RATING:
      return { ...state, ratingsGiven: [action.payload, ...state.ratingsGiven] };

    case DATA_ACTIONS.SET_DASHBOARD_LOADING:
      return { ...state, dashboardLoading: action.payload };
    case DATA_ACTIONS.SET_DASHBOARD_DATA:
      return { ...state, dashboardData: action.payload, dashboardLoading: false, dashboardError: null };
    case DATA_ACTIONS.SET_DASHBOARD_ERROR:
      return { ...state, dashboardError: action.payload, dashboardLoading: false };

    case DATA_ACTIONS.SET_CATEGORIES_LOADING:
      return { ...state, categoriesLoading: action.payload };
    case DATA_ACTIONS.SET_CATEGORIES:
      return { ...state, ratingCategories: action.payload, categoriesLoading: false, categoriesError: null };
    case DATA_ACTIONS.SET_CATEGORIES_ERROR:
      return { ...state, categoriesError: action.payload, categoriesLoading: false };

    case DATA_ACTIONS.SET_PROFILE_LOADING:
      return {
        ...state,
        profilesLoading: { ...state.profilesLoading, [action.payload.userId]: action.payload.loading },
      };
    case DATA_ACTIONS.SET_PROFILE:
      return {
        ...state,
        userProfiles: { ...state.userProfiles, [action.payload.userId]: action.payload.profile },
        profilesLoading: { ...state.profilesLoading, [action.payload.userId]: false },
        profilesError: { ...state.profilesError, [action.payload.userId]: null },
      };
    case DATA_ACTIONS.SET_PROFILE_ERROR:
      return {
        ...state,
        profilesError: { ...state.profilesError, [action.payload.userId]: action.payload.error },
        profilesLoading: { ...state.profilesLoading, [action.payload.userId]: false },
      };

    case DATA_ACTIONS.CLEAR_ERROR:
      return { ...state, [action.payload]: null };

    default:
      return state;
  }
};

// Create context
const DataContext = createContext();

// Data provider component
export const DataProvider = ({ children }) => {
  const [state, dispatch] = useReducer(dataReducer, initialState);

  // Companies actions
  const fetchCompanies = async (params = {}) => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_COMPANIES_LOADING, payload: true });
      const response = await coreAPI.getCompanies(params);
      dispatch({ type: DATA_ACTIONS.SET_COMPANIES, payload: response });
      return response;
    } catch (error) {
      dispatch({ type: DATA_ACTIONS.SET_COMPANIES_ERROR, payload: error.message });
      throw error;
    }
  };

  // Employees actions
  const fetchEmployees = async (params = {}) => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_EMPLOYEES_LOADING, payload: true });
      const response = await coreAPI.getEmployees(params);
      dispatch({ type: DATA_ACTIONS.SET_EMPLOYEES, payload: response });
      return response;
    } catch (error) {
      dispatch({ type: DATA_ACTIONS.SET_EMPLOYEES_ERROR, payload: error.message });
      throw error;
    }
  };

  // Ratings actions
  const fetchRatingsGiven = async (params = {}) => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_RATINGS_LOADING, payload: true });
      const response = await coreAPI.getMyRatingsGiven(params);
      dispatch({ type: DATA_ACTIONS.SET_RATINGS_GIVEN, payload: response.results });
      return response;
    } catch (error) {
      dispatch({ type: DATA_ACTIONS.SET_RATINGS_ERROR, payload: error.message });
      throw error;
    }
  };

  const fetchRatingsReceived = async (params = {}) => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_RATINGS_LOADING, payload: true });
      const response = await coreAPI.getMyRatingsReceived(params);
      dispatch({ type: DATA_ACTIONS.SET_RATINGS_RECEIVED, payload: response.results });
      return response;
    } catch (error) {
      dispatch({ type: DATA_ACTIONS.SET_RATINGS_ERROR, payload: error.message });
      throw error;
    }
  };

  const createRating = async (ratingData) => {
    try {
      const response = await coreAPI.createRating(ratingData);
      dispatch({ type: DATA_ACTIONS.ADD_RATING, payload: response });
      return response;
    } catch (error) {
      throw error;
    }
  };

  // Dashboard actions
  const fetchDashboard = async () => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_DASHBOARD_LOADING, payload: true });
      const response = await coreAPI.getDashboard();
      dispatch({ type: DATA_ACTIONS.SET_DASHBOARD_DATA, payload: response });
      return response;
    } catch (error) {
      dispatch({ type: DATA_ACTIONS.SET_DASHBOARD_ERROR, payload: error.message });
      throw error;
    }
  };

  // Categories actions
  const fetchRatingCategories = async (roleContext) => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_CATEGORIES_LOADING, payload: true });
      const response = await coreAPI.getRatingCategories(roleContext);
      dispatch({ type: DATA_ACTIONS.SET_CATEGORIES, payload: response });
      return response;
    } catch (error) {
      dispatch({ type: DATA_ACTIONS.SET_CATEGORIES_ERROR, payload: error.message });
      throw error;
    }
  };

  // User profile actions
  const fetchUserProfile = async (userId) => {
    try {
      dispatch({ type: DATA_ACTIONS.SET_PROFILE_LOADING, payload: { userId, loading: true } });
      const response = await coreAPI.getUserProfile(userId);
      dispatch({ type: DATA_ACTIONS.SET_PROFILE, payload: { userId, profile: response } });
      return response;
    } catch (error) {
      dispatch({ type: DATA_ACTIONS.SET_PROFILE_ERROR, payload: { userId, error: error.message } });
      throw error;
    }
  };

  const checkRatingEligibility = async (rateeId, roleContext) => {
    try {
      const response = await coreAPI.checkRatingEligibility({ ratee_id: rateeId, role_context: roleContext });
      return response;
    } catch (error) {
      throw error;
    }
  };

  const clearError = (errorType) => {
    dispatch({ type: DATA_ACTIONS.CLEAR_ERROR, payload: errorType });
  };

  const value = {
    // State
    companies: state.companies,
    companiesLoading: state.companiesLoading,
    companiesError: state.companiesError,
    companiesPagination: state.companiesPagination,

    employees: state.employees,
    employeesLoading: state.employeesLoading,
    employeesError: state.employeesError,
    employeesPagination: state.employeesPagination,

    ratingsGiven: state.ratingsGiven,
    ratingsReceived: state.ratingsReceived,
    ratingsLoading: state.ratingsLoading,
    ratingsError: state.ratingsError,

    dashboardData: state.dashboardData,
    dashboardLoading: state.dashboardLoading,
    dashboardError: state.dashboardError,

    ratingCategories: state.ratingCategories,
    categoriesLoading: state.categoriesLoading,
    categoriesError: state.categoriesError,

    userProfiles: state.userProfiles,
    profilesLoading: state.profilesLoading,
    profilesError: state.profilesError,

    // Actions
    fetchCompanies,
    fetchEmployees,
    fetchRatingsGiven,
    fetchRatingsReceived,
    createRating,
    fetchDashboard,
    fetchRatingCategories,
    fetchUserProfile,
    checkRatingEligibility,
    clearError,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

// Custom hook to use data context
export const useData = () => {
  const context = useContext(DataContext);
  if (!context) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export default DataContext;
