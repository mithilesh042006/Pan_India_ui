import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import userService from '../services/userService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Search, MapPin, Star, Users, Filter, User } from 'lucide-react';
import { formatNumber, getRatingColor, getInitials, getAvatarColor } from '../utils/helpers';
import { CITIES, COMMON_SKILLS } from '../utils/constants';

const EmployeesPage = () => {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Employees</h1>
        <p className="mt-2 text-gray-600">
          Discover and rate talented employees across India
        </p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <Card.Body>
          <div className="space-y-4">
            {/* Search Bar */}
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                placeholder="Search employees by name, skills, or city..."
                value={searchParams.search}
                onChange={handleSearchChange}
                className="pl-10"
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
            <Card key={employee.id} hover className="h-full">
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
                    className="flex-1"
                    disabled={!employee.can_rate}
                  >
                    {employee.user_has_rated ? 'Rated' : 'Rate Employee'}
                  </Button>
                  <Button
                    variant="outline"
                    size="small"
                    className="flex items-center"
                  >
                    <User className="w-4 h-4 mr-1" />
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
  );
};

export default EmployeesPage;
