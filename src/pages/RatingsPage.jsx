import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import ratingService from '../services/ratingService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Star, Send, Inbox, Calendar, User, Eye, EyeOff } from 'lucide-react';
import { formatDate, getRatingColor, getInitials, getAvatarColor } from '../utils/helpers';

const RatingsPage = () => {
  const [activeTab, setActiveTab] = useState('received'); // 'received' or 'given'

  // Get ratings received
  const { data: ratingsReceived, isLoading: loadingReceived } = useQuery({
    queryKey: ['my-ratings-received'],
    queryFn: ratingService.getMyRatingsReceived,
    enabled: activeTab === 'received',
  });

  // Get ratings given
  const { data: ratingsGiven, isLoading: loadingGiven } = useQuery({
    queryKey: ['my-ratings-given'],
    queryFn: ratingService.getMyRatingsGiven,
    enabled: activeTab === 'given',
  });

  const isLoading = activeTab === 'received' ? loadingReceived : loadingGiven;
  const ratingsData = activeTab === 'received' ? ratingsReceived : ratingsGiven;
  const ratings = ratingsData?.results || [];

  const calculateAverageRating = (categoryScores) => {
    if (!categoryScores || categoryScores.length === 0) return 0;
    const total = categoryScores.reduce((sum, item) => sum + item.score, 0);
    return (total / categoryScores.length).toFixed(1);
  };

  const RatingCard = ({ rating }) => {
    const averageRating = calculateAverageRating(rating.category_scores);
    const isReceived = activeTab === 'received';
    const displayName = isReceived ? rating.rater_name : rating.ratee_name;
    const isAnonymous = rating.is_anonymous;

    return (
      <Card key={rating.id} className="mb-4">
        <Card.Body>
          <div className="flex items-start justify-between">
            <div className="flex items-start space-x-4 flex-1">
              <div className="flex-shrink-0">
                {!isAnonymous ? (
                  <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(displayName)}`}>
                    {getInitials(displayName)}
                  </div>
                ) : (
                  <div className="w-12 h-12 rounded-full bg-gray-400 flex items-center justify-center text-white">
                    <EyeOff className="w-6 h-6" />
                  </div>
                )}
              </div>

              <div className="flex-1">
                <div className="flex items-center space-x-2 mb-2">
                  <h3 className="text-lg font-semibold text-gray-900">
                    {isAnonymous ? 'Anonymous' : displayName}
                  </h3>
                  <Badge variant={isReceived ? 'success' : 'primary'}>
                    {isReceived ? 'Received' : 'Given'}
                  </Badge>
                  {isAnonymous && (
                    <Badge variant="secondary">
                      <EyeOff className="w-3 h-3 mr-1" />
                      Anonymous
                    </Badge>
                  )}
                </div>

                <div className="flex items-center space-x-4 text-sm text-gray-600 mb-3">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {formatDate(rating.created_at)}
                  </div>
                  <div className="flex items-center">
                    <Star className={`w-4 h-4 mr-1 ${getRatingColor(averageRating)}`} />
                    <span className={`font-medium ${getRatingColor(averageRating)}`}>
                      {averageRating}/5
                    </span>
                  </div>
                </div>

                <Badge variant="info" className="mb-3">
                  {rating.role_context === 'EMPLOYEE_TO_COMPANY' ? 'Company Review' : 'Employee Review'}
                </Badge>
              </div>
            </div>
          </div>

          {/* Category Scores */}
          <div className="mt-4 pt-4 border-t border-gray-200">
            <h4 className="text-sm font-medium text-gray-700 mb-3">Category Ratings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
              {rating.category_scores.map((categoryScore, index) => (
                <div key={index} className="flex justify-between items-center p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">{categoryScore.category}</span>
                  <div className="flex items-center space-x-1">
                    <Star className={`w-4 h-4 ${getRatingColor(categoryScore.score)}`} />
                    <span className={`text-sm font-medium ${getRatingColor(categoryScore.score)}`}>
                      {categoryScore.score}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </Card.Body>
      </Card>
    );
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">My Ratings</h1>
        <p className="mt-2 text-gray-600">
          View and manage your rating history
        </p>
      </div>

      {/* Tabs */}
      <div className="mb-8">
        <div className="border-b border-gray-200">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab('received')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'received'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Inbox className="w-4 h-4 mr-2" />
                Ratings Received
              </div>
            </button>
            <button
              onClick={() => setActiveTab('given')}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === 'given'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <div className="flex items-center">
                <Send className="w-4 h-4 mr-2" />
                Ratings Given
              </div>
            </button>
          </nav>
        </div>
      </div>

      {/* Content */}
      {isLoading ? (
        <div className="flex justify-center items-center min-h-96">
          <LoadingSpinner size="large" text={`Loading ${activeTab} ratings...`} />
        </div>
      ) : ratings.length > 0 ? (
        <div>
          {ratings.map((rating) => (
            <RatingCard key={rating.id} rating={rating} />
          ))}

          {/* Pagination could be added here */}
          {ratingsData?.has_next && (
            <div className="text-center mt-8">
              <Button variant="outline">
                Load More
              </Button>
            </div>
          )}
        </div>
      ) : (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              {activeTab === 'received' ? (
                <>
                  <Inbox className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings received yet</h3>
                  <p className="text-gray-500">
                    When others rate you, their reviews will appear here
                  </p>
                </>
              ) : (
                <>
                  <Send className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No ratings given yet</h3>
                  <p className="text-gray-500 mb-4">
                    Start rating companies or employees to build your review history
                  </p>
                  <Button>
                    Start Rating
                  </Button>
                </>
              )}
            </div>
          </Card.Body>
        </Card>
      )}
    </div>
  );
};

export default RatingsPage;
