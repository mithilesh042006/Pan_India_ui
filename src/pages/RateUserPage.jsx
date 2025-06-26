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
import RatingForm from '../components/forms/RatingForm';

const RateUserPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();



  // Get user profile to rate
  const { data: userProfile, isLoading: profileLoading } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => userService.getUserProfile(id),
  });

  // Get rating categories
  const { data: categoriesData, isLoading: categoriesLoading } = useQuery({
    queryKey: ['rating-categories'],
    queryFn: () => {
      const roleContext = currentUser?.user_role === 'employee' ? 'EMPLOYEE_TO_COMPANY' : 'EMPLOYER_TO_EMPLOYEE';
      return ratingService.getRatingCategories(roleContext);
    },
    enabled: !!currentUser,
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
                      background: getAvatarColor(userProfile?.user_profile?.full_name),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.25rem',
                      margin: '0 auto'
                    }}
                  >
                    {getInitials(userProfile?.user_profile?.full_name)}
                  </div>
                </div>

                <h2 className="text-xl font-bold text-gray-900 mb-2">
                  {userProfile?.user_profile?.full_name}
                </h2>

                <Badge
                  variant={userProfile?.user_profile?.user_role === 'employee' ? 'primary' : 'secondary'}
                  className="mb-4"
                >
                  {userProfile?.user_profile?.user_role === 'employee' ? (
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
                  You are rating this {userProfile?.user_profile?.user_role === 'employee' ? 'employee' : 'company'}
                  as {currentUser?.user_role === 'employee' ? 'an employee' : 'an employer'}.
                </p>
              </Card.Body>
            </Card>
          </div>

          {/* Rating Form */}
          <div className="lg:col-span-2">
            <RatingForm
              rateeId={parseInt(id)}
              rateeName={userProfile?.user_profile?.full_name}
              rateeAvatar={userProfile?.user_profile?.avatar}
              roleContext={currentUser?.user_role === 'employee' ? 'EMPLOYEE_TO_COMPANY' : 'EMPLOYER_TO_EMPLOYEE'}
              onSubmit={(ratingData) => submitRatingMutation.mutate(ratingData)}
              onCancel={() => navigate(-1)}
              isLoading={submitRatingMutation.isPending}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default RateUserPage;
