import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, MapPin, Star, Users, Filter, Building, TrendingUp, Award, Eye, ArrowUpRight } from 'lucide-react';
import { formatNumber, getRatingColor, getInitials, getAvatarColor } from '../utils/helpers';
import { CITIES } from '../utils/constants';

const CompaniesPage = () => {
  const [searchParams, setSearchParams] = useState({
    search: '',
    city: '',
    min_rating: '',
    page: 1,
    page_size: 20,
  });
  const [showFilters, setShowFilters] = useState(false);

  const { data: companiesData, isLoading, error } = useQuery({
    queryKey: ['companies', searchParams],
    queryFn: () => userService.getCompanies(searchParams),
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
      min_rating: '',
      page: 1,
      page_size: 20,
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" text="Loading companies..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600">Failed to load companies</p>
        </div>
      </div>
    );
  }

  const companies = companiesData?.results || [];
  const totalCount = companiesData?.total_count || 0;
  const hasNext = companiesData?.has_next || false;

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div style={{
            background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
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
                    🏢 Companies Directory
                  </h1>
                  <p className="text-lg opacity-90">
                    Discover and rate companies across India
                  </p>
                  <div className="mt-4 flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <TrendingUp style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-sm">Growing Network</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Award style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-sm">Verified Reviews</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Building style={{ width: '3rem', height: '3rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Search and Filters */}
      <Card style={{
        background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
        borderRadius: '20px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
        overflow: 'hidden'
      }} className="mb-8">
        <Card.Body style={{ padding: '2rem' }}>
          <div className="space-y-6">
            {/* Search Header */}
            <div className="text-center mb-6">
              <h3 className="text-xl font-semibold text-gray-900 mb-2">🔍 Find Companies</h3>
              <p className="text-gray-600">Search and filter companies to find the perfect match</p>
            </div>

            {/* Enhanced Search Bar */}
            <div style={{ position: 'relative' }}>
              <div style={{
                position: 'absolute',
                left: '1rem',
                top: '50%',
                transform: 'translateY(-50%)',
                zIndex: 10,
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                padding: '0.5rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
              }}>
                <Search style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
              </div>
              <Input
                placeholder="Search companies by name, city, or industry..."
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
                  e.target.style.borderColor = '#667eea';
                  e.target.style.boxShadow = '0 0 0 3px rgba(102, 126, 234, 0.1)';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#e5e7eb';
                  e.target.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.05)';
                }}
              />
            </div>

            {/* Enhanced Filter Toggle */}
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              borderRadius: '12px',
              padding: '1rem',
              border: '1px solid #e5e7eb'
            }}>
              <Button
                variant="outline"
                size="small"
                onClick={() => setShowFilters(!showFilters)}
                style={{
                  background: showFilters
                    ? 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
                    : 'white',
                  color: showFilters ? 'white' : '#374151',
                  border: showFilters ? 'none' : '2px solid #e5e7eb',
                  borderRadius: '10px',
                  padding: '0.5rem 1rem',
                  transition: 'all 0.2s ease',
                  fontWeight: '500'
                }}
                className="flex items-center"
                onMouseEnter={(e) => {
                  if (!showFilters) {
                    e.target.style.borderColor = '#667eea';
                    e.target.style.color = '#667eea';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!showFilters) {
                    e.target.style.borderColor = '#e5e7eb';
                    e.target.style.color = '#374151';
                  }
                }}
              >
                <Filter style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                {showFilters ? 'Hide Filters' : 'Show Filters'}
              </Button>

              <div className="flex items-center space-x-3">
                <div className="text-sm text-gray-600">
                  {companies.length} companies found
                </div>
                {(searchParams.city || searchParams.min_rating) && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={clearFilters}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '8px',
                      padding: '0.5rem 0.75rem',
                      fontSize: '0.75rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'scale(1.05)';
                      e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'scale(1)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    Clear Filters
                  </Button>
                )}
              </div>
            </div>

            {/* Enhanced Filters */}
            {showFilters && (
              <div style={{
                background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                border: '2px solid #e5e7eb',
                marginTop: '1rem',
                boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)',
                animation: 'slideDown 0.3s ease-out'
              }}>
                <div className="flex items-center mb-4">
                  <div style={{
                    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                    borderRadius: '8px',
                    padding: '0.5rem',
                    marginRight: '0.75rem'
                  }}>
                    <Filter style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                  </div>
                  <h4 className="text-lg font-semibold text-gray-900">Advanced Filters</h4>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <MapPin style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#10b981' }} />
                      City Location
                    </label>
                    <select
                      value={searchParams.city}
                      onChange={(e) => handleFilterChange('city', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#10b981';
                        e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">🌍 All Cities</option>
                      {CITIES.map(city => (
                        <option key={city} value={city}>📍 {city}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-3 flex items-center">
                      <Star style={{ width: '1rem', height: '1rem', marginRight: '0.5rem', color: '#f59e0b' }} />
                      Minimum Rating
                    </label>
                    <select
                      value={searchParams.min_rating}
                      onChange={(e) => handleFilterChange('min_rating', e.target.value)}
                      style={{
                        width: '100%',
                        padding: '0.75rem 1rem',
                        border: '2px solid #e5e7eb',
                        borderRadius: '12px',
                        fontSize: '0.875rem',
                        background: 'white',
                        transition: 'all 0.2s ease',
                        cursor: 'pointer'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#f59e0b';
                        e.target.style.boxShadow = '0 0 0 3px rgba(245, 158, 11, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    >
                      <option value="">⭐ Any Rating</option>
                      <option value="4">⭐⭐⭐⭐ 4+ Stars</option>
                      <option value="3">⭐⭐⭐ 3+ Stars</option>
                      <option value="2">⭐⭐ 2+ Stars</option>
                      <option value="1">⭐ 1+ Stars</option>
                    </select>
                  </div>
                </div>

                {/* Filter Summary */}
                {(searchParams.city || searchParams.min_rating) && (
                  <div style={{
                    marginTop: '1rem',
                    padding: '0.75rem',
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    borderRadius: '8px',
                    border: '1px solid #bfdbfe'
                  }}>
                    <div className="text-sm text-gray-700">
                      <strong>Active Filters:</strong>
                      {searchParams.city && <span className="ml-2 text-blue-600">📍 {searchParams.city}</span>}
                      {searchParams.min_rating && <span className="ml-2 text-yellow-600">⭐ {searchParams.min_rating}+ Stars</span>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <div className="mb-6">
        <p className="text-gray-600">
          Showing {companies.length} of {formatNumber(totalCount)} companies
        </p>
      </div>

      {/* Companies Grid */}
      {companies.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {companies.map((company) => (
            <Card key={company.id}
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
                    {company.avatar ? (
                      <img
                        src={company.avatar}
                        alt={company.full_name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className={`w-12 h-12 rounded-lg flex items-center justify-center text-white font-bold ${getAvatarColor(company.full_name)}`}>
                        {getInitials(company.full_name)}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0">
                    <h3 className="text-lg font-semibold text-gray-900 truncate">
                      {company.full_name}
                    </h3>

                    <div className="flex items-center mt-1">
                      <MapPin className="w-4 h-4 text-gray-400 mr-1" />
                      <span className="text-sm text-gray-600">{company.city}</span>
                    </div>

                    <div className="flex items-center mt-2">
                      <Star className={`w-4 h-4 mr-1 ${getRatingColor(company.rating_received)}`} />
                      <span className={`text-sm font-medium ${getRatingColor(company.rating_received)}`}>
                        {company.rating_received ? company.rating_received.toFixed(1) : 'No ratings'}
                      </span>
                      <span className="text-sm text-gray-500 ml-1">
                        ({company.total_ratings_received || 0} reviews)
                      </span>
                    </div>
                  </div>
                </div>

                {/* Category Averages */}
                {company.category_averages && (
                  <div className="mt-4 pt-4 border-t border-gray-200">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">Category Ratings</h4>
                    <div className="space-y-1">
                      {Object.entries(company.category_averages).slice(0, 3).map(([category, rating]) => (
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
                      background: company.user_has_rated
                        ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                        : 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      border: 'none',
                      color: 'white',
                      borderRadius: '8px',
                      transition: 'all 0.2s ease'
                    }}
                    className="flex-1"
                    disabled={!company.can_rate}
                  >
                    {company.user_has_rated ? (
                      <div className="flex items-center justify-center">
                        <Award style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                        Rated
                      </div>
                    ) : (
                      <div className="flex items-center justify-center">
                        <Star style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                        Rate Company
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
                    onMouseEnter={(e) => {
                      e.target.style.borderColor = '#667eea';
                      e.target.style.color = '#667eea';
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
              <Building className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No companies found</h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or filters
              </p>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* Pagination */}
      {companies.length > 0 && (
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

export default CompaniesPage;
