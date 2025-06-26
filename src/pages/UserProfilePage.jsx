import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import ratingService from '../services/ratingService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { 
  User, Mail, MapPin, Star, Calendar, Award, TrendingUp, 
  MessageSquare, Eye, EyeOff, ArrowLeft, ExternalLink,
  Building, Users, Briefcase, Clock
} from 'lucide-react';
import { formatDate, getRatingColor, getInitials, getAvatarColor } from '../utils/helpers';

const UserProfilePage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user: currentUser } = useAuth();

  const { data: userProfile, isLoading, error } = useQuery({
    queryKey: ['user-profile', id],
    queryFn: () => userService.getUserStats(id),
  });

  const { data: ratingEligibility } = useQuery({
    queryKey: ['rating-eligibility', id],
    queryFn: () => {
      const roleContext = currentUser?.user_role === 'employee' ? 'EMPLOYEE_TO_COMPANY' : 'EMPLOYER_TO_EMPLOYEE';
      return ratingService.checkRatingEligibility(id, roleContext);
    },
    enabled: !!currentUser && currentUser.id !== parseInt(id),
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600">Failed to load user profile</p>
          <Button onClick={() => navigate(-1)} className="mt-4">
            Go Back
          </Button>
        </div>
      </div>
    );
  }

  const profile = userProfile;
  const canRate = ratingEligibility?.eligible && currentUser?.id !== parseInt(id);
  const isOwnProfile = currentUser?.id === parseInt(id);

  const handleRateUser = () => {
    navigate(`/rate/${id}`);
  };

  const RatingCategoryCard = ({ category, data }) => (
    <div className="bg-gray-50 rounded-lg p-4">
      <div className="flex justify-between items-center mb-2">
        <span className="font-medium text-gray-700">{category}</span>
        <div className="flex items-center space-x-2">
          <Star 
            style={{ 
              width: '1rem', 
              height: '1rem', 
              color: getRatingColor(data.average),
              fill: getRatingColor(data.average)
            }} 
          />
          <span className="font-semibold" style={{ color: getRatingColor(data.average) }}>
            {data.average}
          </span>
        </div>
      </div>
      <div className="text-sm text-gray-500">
        Based on {data.count} rating{data.count !== 1 ? 's' : ''}
      </div>
    </div>
  );

  const RecentRatingCard = ({ rating }) => (
    <Card className="mb-4">
      <Card.Body>
        <div className="flex items-start justify-between">
          <div className="flex items-start space-x-3 flex-1">
            <div className="flex-shrink-0">
              {!rating.is_anonymous ? (
                <div 
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    background: getAvatarColor(rating.rater_name),
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontWeight: '600',
                    fontSize: '0.875rem'
                  }}
                >
                  {getInitials(rating.rater_name)}
                </div>
              ) : (
                <div 
                  style={{
                    width: '2.5rem',
                    height: '2.5rem',
                    borderRadius: '50%',
                    background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white'
                  }}
                >
                  <EyeOff style={{ width: '1rem', height: '1rem' }} />
                </div>
              )}
            </div>

            <div className="flex-1">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">
                  {rating.is_anonymous ? 'Anonymous' : rating.rater_name}
                </h4>
                <div className="flex items-center space-x-1">
                  <Star style={{ width: '1rem', height: '1rem', color: '#fbbf24', fill: '#fbbf24' }} />
                  <span className="font-semibold text-gray-900">
                    {(rating.category_scores.reduce((sum, cat) => sum + cat.score, 0) / rating.category_scores.length).toFixed(1)}
                  </span>
                </div>
              </div>

              <div className="flex flex-wrap gap-2 mb-3">
                {rating.category_scores.map((cat, index) => (
                  <Badge key={index} variant="secondary" className="text-xs">
                    {cat.category}: {cat.score}
                  </Badge>
                ))}
              </div>

              {rating.feedback_message && (
                <p className="text-gray-600 text-sm mb-2">
                  "{rating.feedback_message}"
                </p>
              )}

              <div className="flex items-center text-xs text-gray-500">
                <Calendar style={{ width: '0.75rem', height: '0.75rem', marginRight: '0.25rem' }} />
                {formatDate(rating.created_at)}
              </div>
            </div>
          </div>
        </div>
      </Card.Body>
    </Card>
  );

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
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

          {canRate && (
            <Button onClick={handleRateUser} className="flex items-center space-x-2">
              <Star style={{ width: '1rem', height: '1rem' }} />
              <span>Rate {profile.user_role === 'employee' ? 'Employee' : 'Company'}</span>
            </Button>
          )}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Profile Information */}
          <div className="lg:col-span-1">
            <Card>
              <Card.Body className="text-center">
                <div className="mb-6">
                  <div 
                    style={{
                      width: '5rem',
                      height: '5rem',
                      borderRadius: '50%',
                      background: getAvatarColor(profile.full_name),
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontWeight: '600',
                      fontSize: '1.5rem',
                      margin: '0 auto'
                    }}
                  >
                    {getInitials(profile.full_name)}
                  </div>
                </div>

                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile.full_name}
                </h1>

                <Badge 
                  variant={profile.user_role === 'employee' ? 'primary' : 'secondary'}
                  className="mb-4"
                >
                  {profile.user_role === 'employee' ? (
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

                <div className="space-y-3 text-left">
                  <div className="flex items-center text-gray-600">
                    <MapPin style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    <span>{profile.city}</span>
                  </div>

                  <div className="flex items-center text-gray-600">
                    <Calendar style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    <span>Joined {formatDate(profile.date_joined)}</span>
                  </div>

                  {profile.linkedin_url && (
                    <div className="flex items-center text-blue-600">
                      <ExternalLink style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                      <a 
                        href={profile.linkedin_url} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="hover:underline"
                      >
                        LinkedIn Profile
                      </a>
                    </div>
                  )}
                </div>

                {/* Skills for employees */}
                {profile.user_role === 'employee' && profile.skills && profile.skills.length > 0 && (
                  <div className="mt-6">
                    <h3 className="font-semibold text-gray-900 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {profile.skills.map((skill, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>
          </div>

          {/* Rating Statistics and Recent Ratings */}
          <div className="lg:col-span-2 space-y-8">
            {/* Rating Overview */}
            <Card>
              <Card.Header>
                <h2 className="text-xl font-bold text-gray-900 flex items-center">
                  <Award style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                  Rating Overview
                </h2>
              </Card.Header>
              <Card.Body>
                <div className="grid md:grid-cols-3 gap-6 mb-6">
                  <div className="text-center">
                    <div className="text-3xl font-bold mb-2" style={{ color: getRatingColor(profile.average_rating) }}>
                      {profile.average_rating || '0.0'}
                    </div>
                    <div className="text-gray-600">Average Rating</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-blue-600 mb-2">
                      {profile.total_ratings || 0}
                    </div>
                    <div className="text-gray-600">Total Ratings</div>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl font-bold text-green-600 mb-2">
                      {profile.total_ratings > 0 ? '✓' : '—'}
                    </div>
                    <div className="text-gray-600">Verified Profile</div>
                  </div>
                </div>

                {/* Category Breakdown */}
                {profile.ratings_by_category && Object.keys(profile.ratings_by_category).length > 0 && (
                  <div>
                    <h3 className="font-semibold text-gray-900 mb-4">Rating Breakdown</h3>
                    <div className="grid md:grid-cols-2 gap-4">
                      {Object.entries(profile.ratings_by_category).map(([category, data]) => (
                        <RatingCategoryCard key={category} category={category} data={data} />
                      ))}
                    </div>
                  </div>
                )}
              </Card.Body>
            </Card>

            {/* Recent Ratings */}
            {profile.recent_ratings && profile.recent_ratings.length > 0 && (
              <Card>
                <Card.Header>
                  <h2 className="text-xl font-bold text-gray-900 flex items-center">
                    <MessageSquare style={{ width: '1.25rem', height: '1.25rem', marginRight: '0.5rem' }} />
                    Recent Ratings
                  </h2>
                </Card.Header>
                <Card.Body>
                  <div className="space-y-4">
                    {profile.recent_ratings.map((rating) => (
                      <RecentRatingCard key={rating.id} rating={rating} />
                    ))}
                  </div>
                </Card.Body>
              </Card>
            )}

            {/* No ratings message */}
            {(!profile.recent_ratings || profile.recent_ratings.length === 0) && (
              <Card>
                <Card.Body className="text-center py-12">
                  <Star style={{ width: '3rem', height: '3rem', color: '#d1d5db', margin: '0 auto 1rem' }} />
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">No Ratings Yet</h3>
                  <p className="text-gray-600 mb-4">
                    This {profile.user_role === 'employee' ? 'employee' : 'company'} hasn't received any ratings yet.
                  </p>
                  {canRate && (
                    <Button onClick={handleRateUser}>
                      Be the first to rate!
                    </Button>
                  )}
                </Card.Body>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UserProfilePage;
