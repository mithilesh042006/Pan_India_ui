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
      .min(1, 'Rating is required')
      .max(5, 'Rating must be between 1 and 5')
      .required('Rating is required');
  });

  return yup.object({
    is_anonymous: yup.boolean(),
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
  const [categories, setCategories] = useState([]);

  // Get rating categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['rating-categories', roleContext],
    queryFn: () => ratingService.getRatingCategories(roleContext),
  });

  // Check rating eligibility
  const { data: eligibilityData, isLoading: eligibilityLoading } = useQuery({
    queryKey: ['rating-eligibility', rateeId, roleContext],
    queryFn: () => ratingService.checkRatingEligibility(rateeId, roleContext),
    enabled: !!rateeId && !!roleContext,
  });

  useEffect(() => {
    if (categoriesData?.categories) {
      const contextCategories = categoriesData.categories[roleContext] || [];
      setCategories(contextCategories);
    }
  }, [categoriesData, roleContext]);

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
      ...categories.reduce((acc, category) => ({ ...acc, [category]: 0 }), {}),
    },
  });

  const watchedValues = watch();

  const handleFormSubmit = (data) => {
    const categoryScores = categories.map(category => ({
      category,
      score: data[category],
    }));

    const ratingData = {
      ratee: rateeId,
      role_context: roleContext,
      is_anonymous: data.is_anonymous,
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
          <div className="flex space-x-4 pt-4">
            <Button
              type="submit"
              loading={isLoading}
              disabled={isLoading || calculateAverageRating() === '0.0'}
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
        </form>
      </Card.Body>
    </Card>
  );
};

export default RatingForm;
