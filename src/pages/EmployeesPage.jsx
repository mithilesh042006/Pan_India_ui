import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, MapPin, Star, Users, Filter, User, TrendingUp, Award, Eye, ArrowUpRight, UserCheck } from 'lucide-react';
import { formatNumber, getRatingColor, getInitials, getAvatarColor } from '../utils/helpers';
import { CITIES, COMMON_SKILLS } from '../utils/constants';

const EmployeesPage = () => {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useState({
    search: '',
    city: '',
    skills: '',
    min_rating: '',
    page: 1,
    page_size: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: employeesData, isLoading, error } = useQuery({
    queryKey: ['employees', searchParams],
    queryFn: () => userService.getEmployees(searchParams),
  });

  const handleSearchChange = (e) => {
    setSearchParams(prev => ({
      ...prev,
      search: e.target.value,
      page: 1,
    }));
  };

  const handleFilterChange = (field, value) => {
    setSearchParams(prev => ({
      ...prev,
      [field]: value,
      page: 1,
    }));
  };

  const handlePageChange = (newPage) => {
    setSearchParams(prev => ({
      ...prev,
      page: newPage,
    }));
  };

  const clearFilters = () => {
    setSearchParams({
      search: '',
      city: '',
      skills: '',
      min_rating: '',
      page: 1,
      page_size: 20,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" text="Loading employees..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600">Failed to load employees</p>
        </div>
      </div>
    );
  }

  const employees = employeesData?.results || [];
  const totalCount = employeesData?.total_count || 0;
  const hasNext = employeesData?.has_next || false;

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div style={{
            background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
            borderRadius: '20px',
            padding: '2rem',
            color: 'white',
            position: 'relative',
            overflow: 'hidden'
          }}>
            <div style={{
              position: 'absolute',
              top: '-30px',
              right: '-30px',
              width: '150px',
              height: '150px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    👥 Talent Directory
                  </h1>
                  <p className="text-lg opacity-90">
                    Discover and rate talented employees across India
                  </p>
                  <div className="mt-4 flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-sm">Growing Talent Pool</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-sm">Verified Professionals</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <UserCheck style={{ width: '3rem', height: '3rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Search and Filters */}
      <Card style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f0fdf4 100%)',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }} className="mb-8">
        <Card.Body style={{ padding: '2rem' }}>
          <div className="space-y-6">
            {/* Search Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">👥 Find Talent</h3>
              <p className="text-gray-600">Search and filter employees to discover skilled professionals</p>
            </div>

            {/* Enhanced Search Bar */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                borderRadius: '8px',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Search style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
              </div>
              <Input
                placeholder="Search employees by name, skills, city, or expertise..."
                value={searchParams.search}
                onChange={handleSearchChange}
                style={{
                  paddingLeft: '4rem',
                  paddingRight: '1rem',
                  paddingTop: '1rem',
                  paddingBottom: '1rem',
                  fontSize: '1rem',
                  borderRadius: '16px',
                  border: '2px solid #e5e7eb',
                  background: 'white',
                  transition: 'all 0.2s ease',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = '#10b981';
                  e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>

            {/* Filter Toggle */}
            <div className="flex justify-between items-center">
              <Button
                variant="outline"
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              {(searchParams.city || searchParams.skills || searchParams.min_rating) && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={clearFilters}
                >
                  Clear Filters
                </Button>
              )}
            </div>

            {/* Filters */}
            {showFilters && (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-4 border-t border-gray-200">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={searchParams.city}
                    onChange={(e) => handleFilterChange('city', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">All Cities</option>
                    {CITIES.map(city => (
                      <option key={city} value={city}>{city}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Skills
                  </label>
                  <Input
                    placeholder="e.g., React, Python"
                    value={searchParams.skills}
                    onChange={(e) => handleFilterChange('skills', e.target.value)}
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={searchParams.min_rating}
                    onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Rating</option>
                    <option value="4">4+ Stars</option>
                    <option value="3">3+ Stars</option>
                    <option value="2">2+ Stars</option>
                    <option value="1">1+ Stars</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {employees.length} of {formatNumber(totalCount)} employees
        </p>
      </div>

      {/* Employees Grid */}
      {employees.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {employees.map((employee) => (
            <Card key={employee.id}
              style={{
                background: 'white',
                borderRadius: '16px',
                border: '1px solid #e5e7eb',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                transition: 'all 0.3s ease',
                transform: 'translateY(0)'
              }}
              className="h-full hover-lift"
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-8px)';
                e.currentTarget.style.boxShadow = '0 20px 40px rgba(0, 0, 0, 0.1)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.05)';
              }}>
              <Card.Body>
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    {employee.avatar ? (
                      <img
                        src={employee.avatar}
                        alt={employee.full_name}
                        className="w-12 h-12 rounded-full object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(employee.full_name)}`}>
                        {getInitials(employee.full_name)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {employee.full_name}
                    </h3>

                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{employee.city}</span>
                    </div>

                    <div className="flex items-center mt-2">
                      <Star className={`w-4 h-4 mr-1 ${getRatingColor(employee.rating_received)}`} />
                      <span className={`text-sm font-medium ${getRatingColor(employee.rating_received)}`}>
                        {employee.rating_received ? employee.rating_received.toFixed(1) : 'No ratings'}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({employee.total_ratings_received || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Skills */}
                {employee.skills && employee.skills.length > 0 && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Skills</h4>
                    <div className="flex flex-wrap gap-1">
                      {employee.skills.slice(0, 4).map((skill, index) => (
                        <Badge key={index} variant="secondary" size="small">
                          {skill}
                        </Badge>
                      ))}
                      {employee.skills.length > 4 && (
                        <Badge variant="secondary" size="small">
                          +{employee.skills.length - 4} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {/* Category Averages */}
                {employee.category_averages && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Category Ratings</h4>
                    <div className="space-y-1">
                      {Object.entries(employee.category_averages).slice(0, 3).map(([category, rating]) => (
                        <div key={category} className="flex justify-between text-sm">
                          <span className="text-gray-600">{category}</span>
                          <span className={`font-medium ${getRatingColor(rating)}`}>
                            {rating.toFixed(1)}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="mt-4 pt-4 border-t border-gray-200 flex space-x-2">
                  <Button
                    size="small"
                    style={{
                      background: employee.user_has_rated
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    className="flex-1"
                    disabled={!employee.can_rate}
                    onClick={() => employee.can_rate && navigate(`/rate/${employee.id}`)}
                  >
                    {employee.user_has_rated ? (
                      <div className="flex items-center justify-center">
                        <Award style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                        Rated
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Star style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                        Rate Employee
                      </div>
                    )}
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    style={{
                      borderColor: '#d1d5db',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    className="flex items-center"
                    onClick={() => navigate(`/user/${employee.id}`)}
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#10b981';
                      e.target.style.color = '#10b981';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.borderColor = '#d1d5db';
                      e.target.style.color = '#374151';
                    }}
                  >
                    <Eye style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                    View
                  </Button>
                </div>
              </Card.Body>
            </Card>
          ))}
        </div>
      ) : (
        <Card>
          <Card.Body>
            <div className="text-center py-12">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Pagination */}
      {employees.length > 0 && (
        <div className="flex justify-center">
          <div className="flex space-x-2">
            <Button
              variant="outline"
              disabled={searchParams.page === 1}
              onClick={() => handlePageChange(searchParams.page - 1)}
            >
              Previous
            </Button>

            <span className="flex items-center px-4 py-2 text-sm text-gray-700">
              Page {searchParams.page}
            </span>

            <Button
              variant="outline"
              disabled={!hasNext}
              onClick={() => handlePageChange(searchParams.page + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default EmployeesPage;
