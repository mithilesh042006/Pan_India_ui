import React, { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import ratingService from '../../services/ratingService';
import Button from '../ui/Button';
import Card from '../ui/Card';
import LoadingSpinner from '../common/LoadingSpinner';
import { Star, User } from 'lucide-react';
import { RATING_CONTEXTS } from '../../utils/constants';
import { getInitials, getAvatarColor } from '../../utils/helpers';

// Star Rating Component
const StarRating = ({ value, onChange, disabled = false }) => {
  const [hoverValue, setHoverValue] = useState(0);

  return (
    <div className="flex space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          disabled={disabled}
          className={`w-8 h-8 ${disabled ? 'cursor-not-allowed' : 'cursor-pointer'} transition-colors`}
          onMouseEnter={() => !disabled && setHoverValue(star)}
          onMouseLeave={() => !disabled && setHoverValue(0)}
          onClick={() => !disabled && onChange(star)}
        >
          <Star
            className={`w-full h-full ${
              star <= (hoverValue || value)
                ? 'text-yellow-400 fill-current'
                : 'text-gray-300'
            }`}
          />
        </button>
      ))}
    </div>
  );
};

// Validation schema
const createValidationSchema = (categories) => {
  const categoryValidation = {};
  categories.forEach(category => {
    categoryValidation[category] = yup
      .number()
      .test('rating-required', 'Please select a rating for this category', function(value) {
        // Allow 0 as initial value, but require 1-5 when submitting
        return value >= 1 && value <= 5;
      });
  });

  return yup.object({
    is_anonymous: yup.boolean(),
    feedback_message: yup.string().max(1000, 'Feedback message must be less than 1000 characters'),
    ...categoryValidation,
  });
};

const RatingForm = ({ 
  rateeId, 
  rateeName, 
  rateeAvatar, 
  roleContext, 
  onSubmit, 
  onCancel,
  isLoading = false 
}) => {
  // Initialize with fallback categories immediately
  const getFallbackCategories = (context) => {
    return context === 'EMPLOYEE_TO_COMPANY'
      ? ['Work Environment', 'Management Quality', 'Career Growth', 'Work-Life Balance', 'Compensation', 'Company Culture']
      : ['Technical Skills', 'Communication', 'Reliability', 'Team Collaboration', 'Problem Solving', 'Professionalism'];
  };

  const [categories, setCategories] = useState(() =>
    roleContext ? getFallbackCategories(roleContext) : []
  );

  // Get rating categories
  const { data: categoriesData, isLoading: categoriesLoading, error: categoriesError } = useQuery({
    queryKey: ['rating-categories', roleContext],
    queryFn: () => ratingService.getRatingCategories(roleContext),
    enabled: !!roleContext,
    retry: 1,
    staleTime: 5 * 60 * 1000,
  });

  // Check rating eligibility
  const { data: eligibilityData, isLoading: eligibilityLoading } = useQuery({
    queryKey: ['rating-eligibility', rateeId, roleContext],
    queryFn: () => ratingService.checkRatingEligibility(rateeId, roleContext),
    enabled: !!rateeId && !!roleContext,
  });

  useEffect(() => {
    const fallbackCategories = getFallbackCategories(roleContext);

    // If we have a role context, always set categories (either from API or fallback)
    if (roleContext) {
      if (categoriesData) {
        // Check if data is nested under categories object or direct array
        let contextCategories = [];

        if (Array.isArray(categoriesData)) {
          // Direct array response
          contextCategories = categoriesData;
        } else if (categoriesData.categories && categoriesData.categories[roleContext]) {
          // Nested under categories object
          contextCategories = categoriesData.categories[roleContext];
        } else if (categoriesData[roleContext]) {
          // Direct property access
          contextCategories = categoriesData[roleContext];
        }

        // Use API data if valid, otherwise fallback
        setCategories(contextCategories.length > 0 ? contextCategories : fallbackCategories);
      } else if (!categoriesLoading) {
        // If not loading anymore, use fallback (covers error cases and no data)
        setCategories(fallbackCategories);
      }
      // If still loading, keep current categories (which are initialized with fallback)
    }
  }, [categoriesData, categoriesLoading, categoriesError, roleContext]);

  const validationSchema = createValidationSchema(categories);

  const {
    control,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(validationSchema),
    defaultValues: {
      is_anonymous: false,
      feedback_message: '',
      ...categories.reduce((acc, category) => ({ ...acc, [category]: 0 }), {}),
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = (data) => {
    // Filter out categories with 0 scores and ensure all scores are valid
    const categoryScores = categories
      .map(category => ({
        category,
        score: parseInt(data[category]) || 0,
      }))
      .filter(item => item.score > 0 && item.score <= 5);

    // Validate that we have at least one category score
    if (categoryScores.length === 0) {
      console.error('No valid category scores provided');
      return;
    }

    const ratingData = {
      ratee: parseInt(rateeId),
      role_context: roleContext,
      is_anonymous: Boolean(data.is_anonymous),
      feedback_message: data.feedback_message || '',
      category_scores: categoryScores,
    };

    onSubmit(ratingData);
  };

  const calculateAverageRating = () => {
    const scores = categories.map(category => watchedValues[category] || 0);
    const validScores = scores.filter(score => score > 0);
    if (validScores.length === 0) return 0;
    return (validScores.reduce((sum, score) => sum + score, 0) / validScores.length).toFixed(1);
  };

  const hasValidRatings = () => {
    if (!categories || categories.length === 0) return false;

    const scores = categories.map(category => watchedValues[category] || 0);
    const validScores = scores.filter(score => score > 0 && score <= 5);

    return validScores.length === categories.length; // All categories must be rated
  };

  if (categoriesLoading || eligibilityLoading) {
    return <LoadingSpinner text="Loading rating form..." />;
  }

  if (!eligibilityData?.eligible) {
    return (
      <Card>
        <Card.Body className="text-center py-8">
          <div className="text-red-500 text-6xl mb-4">🚫</div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Cannot Rate</h3>
          <p className="text-gray-600">{eligibilityData?.reason}</p>
          <Button onClick={onCancel} className="mt-4">
            Go Back
          </Button>
        </Card.Body>
      </Card>
    );
  }

  return (
    <Card>
      <Card.Header>
        <div className="flex items-center space-x-4">
          <div className="flex-shrink-0">
            {rateeAvatar ? (
              <img
                src={rateeAvatar}
                alt={rateeName}
                className="w-12 h-12 rounded-full object-cover"
              />
            ) : (
              <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(rateeName)}`}>
                {getInitials(rateeName)}
              </div>
            )}
          </div>
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Rate {rateeName}</h3>
            <p className="text-sm text-gray-600">
              {roleContext === RATING_CONTEXTS.EMPLOYEE_TO_COMPANY 
                ? 'Rate this company based on your experience'
                : 'Rate this employee based on their performance'
              }
            </p>
          </div>
        </div>
      </Card.Header>

      <Card.Body>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
          {/* Rating Categories */}
          <div className="space-y-4">
            <h4 className="text-md font-medium text-gray-900">Rating Categories</h4>

            {categories.map((category) => (
              <div key={category} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                <div className="flex-1">
                  <label className="text-sm font-medium text-gray-700">
                    {category}
                  </label>
                  {errors[category] && (
                    <p className="text-xs text-red-600 mt-1">{errors[category].message}</p>
                  )}
                </div>
                
                <div className="flex items-center space-x-4">
                  <Controller
                    name={category}
                    control={control}
                    render={({ field }) => (
                      <StarRating
                        value={field.value}
                        onChange={field.onChange}
                        disabled={isLoading}
                      />
                    )}
                  />
                  <span className="text-sm font-medium text-gray-600 w-8">
                    {watchedValues[category] || 0}/5
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Overall Rating Display */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium text-gray-700">Overall Rating</span>
              <div className="flex items-center space-x-2">
                <Star className="w-5 h-5 text-yellow-400 fill-current" />
                <span className="text-lg font-bold text-gray-900">
                  {calculateAverageRating()}/5
                </span>
              </div>
            </div>
          </div>

          {/* Feedback Message */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Feedback Message (Optional)
            </label>
            <Controller
              name="feedback_message"
              control={control}
              render={({ field }) => (
                <textarea
                  {...field}
                  rows={4}
                  placeholder="Share your experience and feedback..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  disabled={isLoading}
                />
              )}
            />
            {errors.feedback_message && (
              <p className="text-xs text-red-600 mt-1">{errors.feedback_message.message}</p>
            )}
            <p className="text-xs text-gray-500 mt-1">
              Maximum 1000 characters. This feedback will be visible to the person you're rating.
            </p>
          </div>

          {/* Anonymous Option */}
          <div className="flex items-center">
            <Controller
              name="is_anonymous"
              control={control}
              render={({ field }) => (
                <input
                  type="checkbox"
                  id="is_anonymous"
                  checked={field.value}
                  onChange={field.onChange}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
              )}
            />
            <label htmlFor="is_anonymous" className="ml-2 text-sm text-gray-700">
              Submit this rating anonymously
            </label>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            {!hasValidRatings() && (
              <div className="text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded-lg p-3">
                <div className="flex items-center">
                  <div className="text-amber-500 mr-2">⚠️</div>
                  <span>Please rate all categories (1-5 stars) before submitting your review.</span>
                </div>
              </div>
            )}

            <div className="flex space-x-4">
              <Button
                type="submit"
                loading={isLoading}
                disabled={isLoading || !hasValidRatings()}
                className="flex-1"
              >
                Submit Rating
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                disabled={isLoading}
              >
                Cancel
              </Button>
            </div>
          </div>
        </form>
      </Card.Body>
    </Card>
  );
};

export default RatingForm;
