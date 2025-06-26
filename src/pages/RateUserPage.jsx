import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ratingService from '../services/ratingService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import toast from 'react-hot-toast';
import { 
  User, Star, ArrowLeft, Send, Eye, EyeOff, 
  Building, MessageSquare, Award, AlertCircle
} from 'lucide-react';
import { getInitials, getAvatarColor } from '../utils/helpers';
import { RATING_CATEGORIES } from '../config/api';

const RateUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();

  const [ratingData, setRatingData] = useState({
    ratee: parseInt(id),
    role_context: '',
    is_anonymous: false,
    feedback_message: '',
    category_scores: []
  });

  const [errors, setErrors] = useState({});

  // Get user profile to rate
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => userService.getUserStats(id),
  });

  // Get rating categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['rating-categories'],
    queryFn: () => ratingService.getRatingCategories(),
  });

  // Check rating eligibility
  const { data: eligibilityData, isLoading: eligibilityLoading } = useQuery({
    queryKey: ['rating-eligibility', id],
    queryFn: () => {
      const roleContext = currentUser?.user_role === 'employee' ? 'EMPLOYEE_TO_COMPANY' : 'EMPLOYER_TO_EMPLOYEE';
      return ratingService.checkRatingEligibility(id, roleContext);
    },
    enabled: !!currentUser,
  });

  // Submit rating mutation
  const submitRatingMutation = useMutation({
    mutationFn: ratingService.createRating,
    onSuccess: () => {
      toast.success('Rating submitted successfully!');
      queryClient.invalidateQueries(['user-profile', id]);
      queryClient.invalidateQueries(['my-ratings-given']);
      navigate(`/user/${id}`);
    },
    onError: (error) => {
      toast.error(error.message || 'Failed to submit rating');
    },
  });

  // Set up rating context and categories when data loads
  useEffect(() => {
    if (currentUser && userProfile && categoriesData) {
      const roleContext = currentUser.user_role === 'employee' ? 'EMPLOYEE_TO_COMPANY' : 'EMPLOYER_TO_EMPLOYEE';
      const categories = categoriesData.categories[roleContext] || [];
      
      setRatingData(prev => ({
        ...prev,
        role_context: roleContext,
        category_scores: categories.map(category => ({
          category,
          score: 0
        }))
      }));
    }
  }, [currentUser, userProfile, categoriesData]);

  const handleScoreChange = (categoryIndex, score) => {
    setRatingData(prev => ({
      ...prev,
      category_scores: prev.category_scores.map((cat, index) => 
        index === categoryIndex ? { ...cat, score } : cat
      )
    }));
    
    // Clear error for this category
    if (errors[`category_${categoryIndex}`]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[`category_${categoryIndex}`];
        return newErrors;
      });
    }
  };

  const handleFeedbackChange = (e) => {
    setRatingData(prev => ({
      ...prev,
      feedback_message: e.target.value
    }));
  };

  const handleAnonymousToggle = () => {
    setRatingData(prev => ({
      ...prev,
      is_anonymous: !prev.is_anonymous
    }));
  };

  const validateForm = () => {
    const newErrors = {};

    // Check if all categories have scores
    ratingData.category_scores.forEach((cat, index) => {
      if (!cat.score || cat.score < 1 || cat.score > 5) {
        newErrors[`category_${index}`] = 'Please provide a rating between 1 and 5';
      }
    });

    // Check feedback length
    if (ratingData.feedback_message && ratingData.feedback_message.length > 1000) {
      newErrors.feedback = 'Feedback message must be less than 1000 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      toast.error('Please fix the errors before submitting');
      return;
    }

    try {
      await submitRatingMutation.mutateAsync(ratingData);
    } catch (error) {
      // Error handled by mutation
    }
  };

  if (profileLoading || categoriesLoading || eligibilityLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" text="Loading..." />
      </div>
    );
  }

  if (!eligibilityData?.eligible) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Card>
          <Card.Body className="text-center py-12">
            <AlertCircle style={{ width: '3rem', height: '3rem', color: '#ef4444', margin: '0 auto 1rem' }} />
            <h2 className="text-xl font-bold text-gray-900 mb-2">Cannot Rate This User</h2>
            <p className="text-gray-600 mb-4">
              {eligibilityData?.reason || 'You are not eligible to rate this user.'}
            </p>
            <Button onClick={() => navigate(-1)}>
              Go Back
            </Button>
          </Card.Body>
        </Card>
      </div>
    );
  }

  const StarRating = ({ score, onScoreChange, error }) => (
    <div className="flex items-center space-x-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onScoreChange(star)}
          className="focus:outline-none transition-colors"
        >
          <Star
            style={{
              width: '1.5rem',
              height: '1.5rem',
              color: star <= score ? '#fbbf24' : '#d1d5db',
              fill: star <= score ? '#fbbf24' : 'none',
              cursor: 'pointer'
            }}
          />
        </button>
      ))}
      <span className="ml-2 text-sm font-medium text-gray-700">
        {score > 0 ? `${score}/5` : 'Not rated'}
      </span>
      {error && (
        <span className="ml-2 text-sm text-red-600">{error}</span>
      )}
    </div>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <Button 
            variant="outline" 
            onClick={() => navigate(-1)}
            className="flex items-center space-x-2"
          >
            <ArrowLeft style={{ width: '1rem', height: '1rem' }} />
            <span>Back</span>
          </Button>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* User Profile Summary */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Body className="text-center">
                <div className="mb-4">
                  <div 
                    style={{
                      width: '4rem',
                      height: '4rem',
                      borderRadius: '50%',
                      background: getAvatarColor(userProfile.full_name),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.25rem',
                      margin: '0 auto'
                    }}
                  >
                    {getInitials(userProfile.full_name)}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {userProfile.full_name}
                </h2>

                <Badge 
                  variant={userProfile.user_role === 'employee' ? 'primary' : 'secondary'}
                  className="mb-4"
                >
                  {userProfile.user_role === 'employee' ? (
                    <>
                      <User style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }} />
                      Employee
                    </>
                  ) : (
                    <>
                      <Building style={{ width: '0.875rem', height: '0.875rem', marginRight: '0.25rem' }} />
                      Company
                    </>
                  )}
                </Badge>

                <p className="text-gray-600 text-sm">
                  You are rating this {userProfile.user_role === 'employee' ? 'employee' : 'company'} 
                  as {currentUser?.user_role === 'employee' ? 'an employee' : 'an employer'}.
                </p>
              </Card.Body>
            </Card>
          </div>

          {/* Rating Form */}
          <div className="lg:col-span-2">
            <Card>
              <Card.Header>
                <h1 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Award style={{ width: '1.5rem', height: '1.5rem', marginRight: '0.5rem' }} />
                  Rate {userProfile.full_name}
                </h1>
              </Card.Header>
              <Card.Body>
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Category Ratings */}
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Rate by Category
                    </h3>
                    <div className="space-y-4">
                      {ratingData.category_scores.map((category, index) => (
                        <div key={index} className="bg-gray-50 rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <label className="font-medium text-gray-700">
                              {category.category}
                            </label>
                          </div>
                          <StarRating
                            score={category.score}
                            onScoreChange={(score) => handleScoreChange(index, score)}
                            error={errors[`category_${index}`]}
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Feedback Message */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Feedback Message (Optional)
                    </label>
                    <textarea
                      value={ratingData.feedback_message}
                      onChange={handleFeedbackChange}
                      placeholder="Share your experience working with this person/company..."
                      rows={4}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      maxLength={1000}
                    />
                    <div className="flex justify-between items-center mt-1">
                      <span className="text-xs text-gray-500">
                        {ratingData.feedback_message.length}/1000 characters
                      </span>
                      {errors.feedback && (
                        <span className="text-xs text-red-600">{errors.feedback}</span>
                      )}
                    </div>
                  </div>

                  {/* Anonymous Option */}
                  <div className="flex items-center space-x-3">
                    <button
                      type="button"
                      onClick={handleAnonymousToggle}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg border transition-colors ${
                        ratingData.is_anonymous
                          ? 'bg-blue-50 border-blue-200 text-blue-700'
                          : 'bg-gray-50 border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {ratingData.is_anonymous ? (
                        <EyeOff style={{ width: '1rem', height: '1rem' }} />
                      ) : (
                        <Eye style={{ width: '1rem', height: '1rem' }} />
                      )}
                      <span className="text-sm font-medium">
                        {ratingData.is_anonymous ? 'Anonymous Rating' : 'Public Rating'}
                      </span>
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg">
                    <p className="mb-1">
                      <strong>Note:</strong> {ratingData.is_anonymous ? 'Anonymous ratings' : 'Public ratings'} 
                      {ratingData.is_anonymous 
                        ? ' hide your identity from other users, but the person being rated will still see your feedback.'
                        : ' show your name to everyone who views this profile.'
                      }
                    </p>
                  </div>

                  {/* Submit Button */}
                  <div className="flex justify-end space-x-4">
                    <Button
                      type="button"
                      variant="outline"
                      onClick={() => navigate(-1)}
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      disabled={submitRatingMutation.isPending}
                      className="flex items-center space-x-2"
                    >
                      {submitRatingMutation.isPending ? (
                        <LoadingSpinner size="small" />
                      ) : (
                        <Send style={{ width: '1rem', height: '1rem' }} />
                      )}
                      <span>
                        {submitRatingMutation.isPending ? 'Submitting...' : 'Submit Rating'}
                      </span>
                    </Button>
                  </div>
                </form>
              </Card.Body>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateUserPage;
