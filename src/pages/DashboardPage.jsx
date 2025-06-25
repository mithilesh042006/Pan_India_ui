import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import userService from '../services/userService';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { Star, Users, TrendingUp, Award, BarChart3, Calendar, Eye, Settings, ArrowUpRight, Activity } from 'lucide-react';

const DashboardPage = () => {
  const { user } = useAuth();

  const { data: dashboardData, isLoading, error } = useQuery({
    queryKey: ['dashboard'],
    queryFn: userService.getDashboard,
  });

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" text="Loading dashboard..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center">
          <p className="text-red-600">Failed to load dashboard data</p>
        </div>
      </div>
    );
  }

  const stats = dashboardData?.stats || {};
  const recentRatings = dashboardData?.recent_ratings || [];

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Welcome Section */}
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
              top: '-50px',
              right: '-50px',
              width: '200px',
              height: '200px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '50%'
            }}></div>
            <div style={{
              position: 'absolute',
              bottom: '-30px',
              left: '-30px',
              width: '150px',
              height: '150px',
              background: 'rgba(255, 255, 255, 0.05)',
              borderRadius: '50%'
            }}></div>
            <div style={{ position: 'relative', zIndex: 1 }}>
              <div className="flex items-center justify-between">
                <div>
                  <h1 className="text-3xl font-bold mb-2">
                    Welcome back, {user?.full_name}! 👋
                  </h1>
                  <p className="text-lg opacity-90">
                    Here's an overview of your rating activity and achievements
                  </p>
                  <div className="mt-4 flex items-center space-x-4">
                    <div className="flex items-center space-x-2">
                      <Activity style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-sm">Active since {new Date(user?.date_joined || Date.now()).getFullYear()}</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Users style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-sm capitalize">{user?.user_role} Account</span>
                    </div>
                  </div>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '16px',
                  padding: '1rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <Star style={{ width: '3rem', height: '3rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <Card style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          color: 'white',
          transform: 'translateY(0)',
          transition: 'all 0.3s ease'
        }}
        className="hover-lift"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(102, 126, 234, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Average Rating</p>
              <p className="text-3xl font-bold mt-2">
                {stats.average_rating ? stats.average_rating.toFixed(1) : '0.0'}
              </p>
              <div className="flex items-center mt-2">
                <ArrowUpRight style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                <span className="text-xs opacity-75">Based on reviews</span>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <Star style={{ width: '2rem', height: '2rem' }} />
            </div>
          </div>
        </Card>

        <Card style={{
          background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
          border: 'none',
          color: 'white',
          transform: 'translateY(0)',
          transition: 'all 0.3s ease'
        }}
        className="hover-lift"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(16, 185, 129, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Ratings Given</p>
              <p className="text-3xl font-bold mt-2">
                {stats.ratings_given || 0}
              </p>
              <div className="flex items-center mt-2">
                <TrendingUp style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                <span className="text-xs opacity-75">Your contributions</span>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <BarChart3 style={{ width: '2rem', height: '2rem' }} />
            </div>
          </div>
        </Card>

        <Card style={{
          background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
          border: 'none',
          color: 'white',
          transform: 'translateY(0)',
          transition: 'all 0.3s ease'
        }}
        className="hover-lift"
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-8px)';
          e.currentTarget.style.boxShadow = '0 20px 40px rgba(139, 92, 246, 0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = '0 4px 6px rgba(0, 0, 0, 0.1)';
        }}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium opacity-90">Ratings Received</p>
              <p className="text-3xl font-bold mt-2">
                {stats.ratings_received || 0}
              </p>
              <div className="flex items-center mt-2">
                <Award style={{ width: '1rem', height: '1rem', marginRight: '0.25rem' }} />
                <span className="text-xs opacity-75">Community feedback</span>
              </div>
            </div>
            <div style={{
              background: 'rgba(255, 255, 255, 0.2)',
              borderRadius: '16px',
              padding: '1rem',
              backdropFilter: 'blur(10px)'
            }}>
              <Award style={{ width: '2rem', height: '2rem' }} />
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Ratings */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <Card.Header>
            <h3 className="text-lg font-semibold text-gray-900">Recent Ratings Received</h3>
          </Card.Header>
          <Card.Body>
            {recentRatings.length > 0 ? (
              <div className="space-y-4">
                {recentRatings.slice(0, 5).map((rating) => (
                  <div key={rating.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">
                        {rating.is_anonymous ? 'Anonymous' : rating.rater_name}
                      </p>
                      <p className="text-sm text-gray-500">
                        {new Date(rating.created_at).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <Badge variant="primary">
                        {rating.role_context === 'EMPLOYEE_TO_COMPANY' ? 'Employee Review' : 'Employer Review'}
                      </Badge>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No ratings received yet</p>
              </div>
            )}
          </Card.Body>
        </Card>

        <Card style={{
          background: 'white',
          border: '1px solid #e5e7eb',
          borderRadius: '16px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05)'
        }}>
          <Card.Header style={{ borderBottom: '1px solid #f3f4f6', paddingBottom: '1rem' }}>
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-900">Quick Actions</h3>
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '8px',
                padding: '0.5rem',
                color: 'white'
              }}>
                <Activity style={{ width: '1.25rem', height: '1.25rem' }} />
              </div>
            </div>
          </Card.Header>
          <Card.Body>
            <div className="space-y-3">
              {user?.user_role === 'employee' && (
                <a
                  href="/companies"
                  style={{
                    display: 'block',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                    borderRadius: '12px',
                    border: '1px solid #bfdbfe',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(59, 130, 246, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <Users style={{ width: '1.5rem', height: '1.5rem' }} />
                      </div>
                      <div style={{ marginLeft: '1rem' }}>
                        <p className="font-semibold text-gray-900">Browse Companies</p>
                        <p className="text-sm text-gray-600">Find and rate companies</p>
                      </div>
                    </div>
                    <ArrowUpRight style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                  </div>
                </a>
              )}

              {user?.user_role === 'employer' && (
                <a
                  href="/employees"
                  style={{
                    display: 'block',
                    padding: '1rem',
                    background: 'linear-gradient(135deg, #ecfdf5 0%, #d1fae5 100%)',
                    borderRadius: '12px',
                    border: '1px solid #a7f3d0',
                    textDecoration: 'none',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(34, 197, 94, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div style={{
                        width: '3rem',
                        height: '3rem',
                        background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: 'white'
                      }}>
                        <Users style={{ width: '1.5rem', height: '1.5rem' }} />
                      </div>
                      <div style={{ marginLeft: '1rem' }}>
                        <p className="font-semibold text-gray-900">Browse Employees</p>
                        <p className="text-sm text-gray-600">Find and rate employees</p>
                      </div>
                    </div>
                    <ArrowUpRight style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                  </div>
                </a>
              )}

              <a
                href="/ratings"
                style={{
                  display: 'block',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                  borderRadius: '12px',
                  border: '1px solid #d8b4fe',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(168, 85, 247, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'linear-gradient(135deg, #a855f7 0%, #9333ea 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <Star style={{ width: '1.5rem', height: '1.5rem' }} />
                    </div>
                    <div style={{ marginLeft: '1rem' }}>
                      <p className="font-semibold text-gray-900">My Ratings</p>
                      <p className="text-sm text-gray-600">View your rating history</p>
                    </div>
                  </div>
                  <ArrowUpRight style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                </div>
              </a>

              <a
                href="/profile"
                style={{
                  display: 'block',
                  padding: '1rem',
                  background: 'linear-gradient(135deg, #f9fafb 0%, #f3f4f6 100%)',
                  borderRadius: '12px',
                  border: '1px solid #d1d5db',
                  textDecoration: 'none',
                  transition: 'all 0.2s ease'
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = 'translateY(-2px)';
                  e.target.style.boxShadow = '0 8px 25px rgba(107, 114, 128, 0.15)';
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = 'translateY(0)';
                  e.target.style.boxShadow = 'none';
                }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div style={{
                      width: '3rem',
                      height: '3rem',
                      background: 'linear-gradient(135deg, #6b7280 0%, #4b5563 100%)',
                      borderRadius: '12px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white'
                    }}>
                      <Settings style={{ width: '1.5rem', height: '1.5rem' }} />
                    </div>
                    <div style={{ marginLeft: '1rem' }}>
                      <p className="font-semibold text-gray-900">Update Profile</p>
                      <p className="text-sm text-gray-600">Manage your account settings</p>
                    </div>
                  </div>
                  <ArrowUpRight style={{ width: '1.25rem', height: '1.25rem', color: '#6b7280' }} />
                </div>
              </a>
            </div>
          </Card.Body>
        </Card>
      </div>
      </div>
    </div>
  );
};

export default DashboardPage;
