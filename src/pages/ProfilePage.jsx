import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { useAuth } from '../context/AuthContext';
import authService from '../services/authService';
import Card from '../components/ui/Card';
import Button from '../components/ui/Button';
import Input from '../components/ui/Input';
import Badge from '../components/ui/Badge';
import LoadingSpinner from '../components/common/LoadingSpinner';
import { User, Mail, MapPin, Star, Calendar, Edit3, Save, X } from 'lucide-react';
import { formatDate, getInitials, getAvatarColor } from '../utils/helpers';

const ProfilePage = () => {
  const { user, updateUser } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({
    full_name: user?.full_name || '',
    city: user?.city || '',
    skills: user?.skills?.join(', ') || '',
    linkedin_url: user?.linkedin_url || '',
  });

  const { data: profileData, isLoading, refetch } = useQuery({
    queryKey: ['profile'],
    queryFn: authService.getProfile,
  });

  const handleEditToggle = () => {
    if (isEditing) {
      // Reset form when canceling
      setEditForm({
        full_name: user?.full_name || '',
        city: user?.city || '',
        skills: user?.skills?.join(', ') || '',
        linkedin_url: user?.linkedin_url || '',
      });
    }
    setIsEditing(!isEditing);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSave = async () => {
    try {
      const updateData = {
        ...editForm,
        skills: editForm.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
      };

      await updateUser(updateData);
      setIsEditing(false);
      refetch();
    } catch (error) {
      console.error('Failed to update profile:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-96">
        <LoadingSpinner size="large" text="Loading profile..." />
      </div>
    );
  }

  const profile = profileData || user;

  return (
    <div style={{ background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)', minHeight: '100vh' }}>
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Header */}
        <div className="mb-8">
          <div style={{
            background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
            borderRadius: '24px',
            padding: '2.5rem',
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
                  <h1 className="text-4xl font-bold mb-3">
                    👤 Profile Settings
                  </h1>
                  <p className="text-xl opacity-90 mb-4">
                    Manage your account information and preferences
                  </p>
                  {/* <div className="flex items-center space-x-6">
                    <div className="flex items-center space-x-2">
                      <User style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-sm">Personal Info</span>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Edit3 style={{ width: '1.25rem', height: '1.25rem' }} />
                      <span className="text-sm">Edit Profile</span>
                    </div>
                  </div> */}
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '20px',
                  padding: '1.5rem',
                  backdropFilter: 'blur(10px)'
                }}>
                  <User style={{ width: '4rem', height: '4rem' }} />
                </div>
              </div>
            </div>
          </div>
        </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Enhanced Profile Overview */}
        <div className="lg:col-span-1">
          <Card style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
            <Card.Body style={{ padding: '2rem' }} className="text-center">
              {/* Avatar Section */}
              <div className="mb-6 relative">
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  display: 'inline-block',
                  marginBottom: '1rem'
                }}>
                  {profile?.avatar ? (
                    <img
                      src={profile.avatar}
                      alt={profile.full_name}
                      style={{
                        width: '6rem',
                        height: '6rem',
                        borderRadius: '50%',
                        objectFit: 'cover',
                        border: '3px solid white'
                      }}
                    />
                  ) : (
                    <div style={{
                      width: '6rem',
                      height: '6rem',
                      borderRadius: '50%',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: 'white',
                      fontSize: '2rem',
                      fontWeight: 'bold',
                      background: getAvatarColor(profile?.full_name || 'User'),
                      border: '3px solid white'
                    }}>
                      {getInitials(profile?.full_name || 'User')}
                    </div>
                  )}
                </div>

                {/* Online Status Indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: '1rem',
                  right: '50%',
                  transform: 'translateX(50%)',
                  width: '1rem',
                  height: '1rem',
                  background: '#10b981',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}></div>
              </div>

              {/* Name and Role */}
              <div className="mb-6">
                <h3 className="text-2xl font-bold text-gray-900 mb-2">
                  {profile?.full_name}
                </h3>

                <div style={{
                  display: 'inline-block',
                  background: profile?.user_role === 'employee'
                    ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                    : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                  color: 'white',
                  padding: '0.5rem 1rem',
                  borderRadius: '20px',
                  fontSize: '0.875rem',
                  fontWeight: '500',
                  marginBottom: '1rem'
                }}>
                  {profile?.user_role === 'employee' ? '👨‍💼 Employee' : '🏢 Employer'}
                </div>
              </div>

              {/* Profile Stats */}
              <div style={{
                background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
                borderRadius: '16px',
                padding: '1.5rem',
                marginBottom: '1.5rem'
              }}>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div style={{
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        marginRight: '0.75rem'
                      }}>
                        <Mail style={{ width: '1rem', height: '1rem', color: 'white' }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Email</span>
                    </div>
                    <span className="text-sm text-gray-600 truncate max-w-32">{profile?.email}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div style={{
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        marginRight: '0.75rem'
                      }}>
                        <MapPin style={{ width: '1rem', height: '1rem', color: 'white' }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Location</span>
                    </div>
                    <span className="text-sm text-gray-600">{profile?.city || 'Not specified'}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div style={{
                        background: 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        marginRight: '0.75rem'
                      }}>
                        <Star style={{ width: '1rem', height: '1rem', color: 'white' }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Rating</span>
                    </div>
                    <span className="text-sm text-gray-600">
                      {profile?.rating_received ? `${profile.rating_received.toFixed(1)} ⭐` : 'No ratings'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center">
                      <div style={{
                        background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                        borderRadius: '8px',
                        padding: '0.5rem',
                        marginRight: '0.75rem'
                      }}>
                        <Calendar style={{ width: '1rem', height: '1rem', color: 'white' }} />
                      </div>
                      <span className="text-sm font-medium text-gray-700">Joined</span>
                    </div>
                    <span className="text-sm text-gray-600">{formatDate(profile?.date_joined)}</span>
                  </div>
                </div>
              </div>

              {/* Quick Actions */}
              <div className="space-y-2">
                {/* <Button
                  style={{
                    width: '100%',
                    background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    border: 'none',
                    borderRadius: '12px',
                    padding: '0.75rem',
                    color: 'white',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-2px)';
                    e.target.style.boxShadow = '0 8px 25px rgba(99, 102, 241, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  <Edit3 style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                  Edit Profile
                </Button> */}
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Enhanced Profile Details */}
        <div className="lg:col-span-2">
          <Card style={{
            background: 'linear-gradient(135deg, #ffffff 0%, #f8fafc 100%)',
            borderRadius: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px rgba(0, 0, 0, 0.08)',
            overflow: 'hidden'
          }}>
            <Card.Header style={{
              background: 'linear-gradient(135deg, #f1f5f9 0%, #e2e8f0 100%)',
              borderBottom: '1px solid #e5e7eb',
              padding: '1.5rem 2rem'
            }} className="flex justify-between items-center">
              <div className="flex items-center">
                <div style={{
                  background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                  borderRadius: '12px',
                  padding: '0.75rem',
                  marginRight: '1rem'
                }}>
                  <User style={{ width: '1.5rem', height: '1.5rem', color: 'white' }} />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900">Profile Information</h3>
                  <p className="text-sm text-gray-600">Manage your personal details and preferences</p>
                </div>
              </div>

              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="small"
                  onClick={isEditing ? handleSave : handleEditToggle}
                  style={{
                    background: isEditing
                      ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                      : 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                    color: 'white',
                    border: 'none',
                    borderRadius: '10px',
                    padding: '0.5rem 1rem',
                    fontWeight: '500',
                    transition: 'all 0.2s ease'
                  }}
                  className="flex items-center"
                  onMouseEnter={(e) => {
                    e.target.style.transform = 'translateY(-1px)';
                    e.target.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.transform = 'translateY(0)';
                    e.target.style.boxShadow = 'none';
                  }}
                >
                  {isEditing ? (
                    <>
                      <Save style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                      Save Changes
                    </>
                  ) : (
                    <>
                      <Edit3 style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                      Edit Profile
                    </>
                  )}
                </Button>

                {isEditing && (
                  <Button
                    variant="secondary"
                    size="small"
                    onClick={handleEditToggle}
                    style={{
                      background: 'linear-gradient(135deg, #ef4444 0%, #dc2626 100%)',
                      color: 'white',
                      border: 'none',
                      borderRadius: '10px',
                      padding: '0.5rem 1rem',
                      fontWeight: '500',
                      transition: 'all 0.2s ease'
                    }}
                    className="flex items-center"
                    onMouseEnter={(e) => {
                      e.target.style.transform = 'translateY(-1px)';
                      e.target.style.boxShadow = '0 4px 12px rgba(239, 68, 68, 0.3)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.transform = 'translateY(0)';
                      e.target.style.boxShadow = 'none';
                    }}
                  >
                    <X style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }} />
                    Cancel
                  </Button>
                )}
              </div>
            </Card.Header>

            <Card.Body style={{ padding: '2rem' }}>
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* Full Name Field */}
                  <div className="flex flex-col">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        background: 'linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <User style={{ width: '1rem', height: '1rem', color: 'white' }} />
                      </div>
                      <span>Full Name</span>
                    </label>
                    {isEditing ? (
                      <Input
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                        style={{
                          padding: '0.875rem 1rem',
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s ease',
                          minHeight: '3rem'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#6366f1';
                          e.target.style.boxShadow = '0 0 0 3px rgba(99, 102, 241, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    ) : (
                      <div style={{
                        background: 'linear-gradient(135deg, #f8fafc 0%, #f1f5f9 100%)',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        border: '1px solid #e5e7eb',
                        minHeight: '3rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <p className="text-gray-900 font-medium">{profile?.full_name}</p>
                      </div>
                    )}
                  </div>

                  {/* Email Field */}
                  <div className="flex flex-col">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        background: 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <Mail style={{ width: '1rem', height: '1rem', color: 'white' }} />
                      </div>
                      <span>Email Address</span>
                    </label>
                    <div style={{
                      background: 'linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%)',
                      borderRadius: '12px',
                      padding: '0.875rem 1rem',
                      border: '1px solid #bfdbfe',
                      minHeight: '3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <p className="text-gray-900 font-medium">{profile?.email}</p>
                      <p className="text-xs text-blue-600 mt-1 flex items-center">
                        🔒 Email cannot be changed for security reasons
                      </p>
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {/* City Field */}
                  <div className="flex flex-col">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <MapPin style={{ width: '1rem', height: '1rem', color: 'white' }} />
                      </div>
                      <span>City Location</span>
                    </label>
                    {isEditing ? (
                      <Input
                        name="city"
                        value={editForm.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                        style={{
                          padding: '0.875rem 1rem',
                          borderRadius: '12px',
                          border: '2px solid #e5e7eb',
                          fontSize: '0.875rem',
                          transition: 'all 0.2s ease',
                          minHeight: '3rem'
                        }}
                        onFocus={(e) => {
                          e.target.style.borderColor = '#10b981';
                          e.target.style.boxShadow = '0 0 0 3px rgba(16, 185, 129, 0.1)';
                        }}
                        onBlur={(e) => {
                          e.target.style.borderColor = '#e5e7eb';
                          e.target.style.boxShadow = 'none';
                        }}
                      />
                    ) : (
                      <div style={{
                        background: 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)',
                        borderRadius: '12px',
                        padding: '0.875rem 1rem',
                        border: '1px solid #bbf7d0',
                        minHeight: '3rem',
                        display: 'flex',
                        alignItems: 'center'
                      }}>
                        <p className="text-gray-900 font-medium flex items-center">
                          📍 {profile?.city || 'Not specified'}
                        </p>
                      </div>
                    )}
                  </div>

                  {/* User Role Field */}
                  <div className="flex flex-col">
                    <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                      <div style={{
                        width: '2rem',
                        height: '2rem',
                        background: profile?.user_role === 'employee'
                          ? 'linear-gradient(135deg, #10b981 0%, #059669 100%)'
                          : 'linear-gradient(135deg, #f59e0b 0%, #d97706 100%)',
                        borderRadius: '8px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginRight: '0.75rem'
                      }}>
                        <User style={{ width: '1rem', height: '1rem', color: 'white' }} />
                      </div>
                      <span>User Role</span>
                    </label>
                    <div style={{
                      background: profile?.user_role === 'employee'
                        ? 'linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%)'
                        : 'linear-gradient(135deg, #fffbeb 0%, #fef3c7 100%)',
                      borderRadius: '12px',
                      padding: '0.875rem 1rem',
                      border: profile?.user_role === 'employee'
                        ? '1px solid #bbf7d0'
                        : '1px solid #fde68a',
                      minHeight: '3rem',
                      display: 'flex',
                      flexDirection: 'column',
                      justifyContent: 'center'
                    }}>
                      <p className="text-gray-900 font-medium capitalize flex items-center">
                        {profile?.user_role === 'employee' ? '👨‍💼' : '🏢'} {profile?.user_role}
                      </p>
                      <p className="text-xs text-gray-600 mt-1 flex items-center">
                        🔒 Role cannot be changed after registration
                      </p>
                    </div>
                  </div>
                </div>

                {/* Skills/Services Field */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem'
                    }}>
                      <Star style={{ width: '1rem', height: '1rem', color: 'white' }} />
                    </div>
                    <span>{profile?.user_role === 'employer' ? 'Services/Industry' : 'Skills & Expertise'}</span>
                  </label>
                  {isEditing ? (
                    <Input
                      name="skills"
                      value={editForm.skills}
                      onChange={handleInputChange}
                      placeholder={profile?.user_role === 'employer' ? 'e.g., Software Development, Consulting, Marketing' : 'e.g., Python, React, Node.js, Project Management (comma separated)'}
                      style={{
                        padding: '0.875rem 1rem',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        minHeight: '3rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#8b5cf6';
                        e.target.style.boxShadow = '0 0 0 3px rgba(139, 92, 246, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ) : (
                    <div style={{
                      background: 'linear-gradient(135deg, #faf5ff 0%, #f3e8ff 100%)',
                      borderRadius: '12px',
                      padding: '1rem',
                      border: '1px solid #e9d5ff',
                      minHeight: '4rem',
                      display: 'flex',
                      alignItems: profile?.skills?.length > 0 ? 'flex-start' : 'center'
                    }}>
                      {profile?.skills?.length > 0 ? (
                        <div className="flex flex-wrap gap-2 w-full">
                          {profile.skills.map((skill, index) => (
                            <div
                              key={index}
                              style={{
                                background: 'linear-gradient(135deg, #8b5cf6 0%, #7c3aed 100%)',
                                color: 'white',
                                padding: '0.375rem 0.875rem',
                                borderRadius: '20px',
                                fontSize: '0.75rem',
                                fontWeight: '500',
                                display: 'inline-flex',
                                alignItems: 'center',
                                boxShadow: '0 2px 4px rgba(139, 92, 246, 0.2)'
                              }}
                            >
                              ⚡ {skill}
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-gray-500 italic">No skills added yet</p>
                      )}
                    </div>
                  )}
                </div>

                {/* LinkedIn URL Field */}
                <div className="flex flex-col">
                  <label className="flex items-center text-sm font-semibold text-gray-700 mb-3">
                    <div style={{
                      width: '2rem',
                      height: '2rem',
                      background: 'linear-gradient(135deg, #0077b5 0%, #005885 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem'
                    }}>
                      <span style={{ color: 'white', fontSize: '0.875rem', fontWeight: 'bold' }}>in</span>
                    </div>
                    <span>LinkedIn Profile</span>
                  </label>
                  {isEditing ? (
                    <Input
                      name="linkedin_url"
                      value={editForm.linkedin_url}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                      style={{
                        padding: '0.875rem 1rem',
                        borderRadius: '12px',
                        border: '2px solid #e5e7eb',
                        fontSize: '0.875rem',
                        transition: 'all 0.2s ease',
                        minHeight: '3rem'
                      }}
                      onFocus={(e) => {
                        e.target.style.borderColor = '#0077b5';
                        e.target.style.boxShadow = '0 0 0 3px rgba(0, 119, 181, 0.1)';
                      }}
                      onBlur={(e) => {
                        e.target.style.borderColor = '#e5e7eb';
                        e.target.style.boxShadow = 'none';
                      }}
                    />
                  ) : (
                    <div style={{
                      background: 'linear-gradient(135deg, #eff8ff 0%, #dbeafe 100%)',
                      borderRadius: '12px',
                      padding: '0.875rem 1rem',
                      border: '1px solid #bfdbfe',
                      minHeight: '3rem',
                      display: 'flex',
                      alignItems: 'center'
                    }}>
                      {profile?.linkedin_url ? (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          style={{
                            color: '#0077b5',
                            textDecoration: 'none',
                            fontWeight: '500',
                            display: 'flex',
                            alignItems: 'center',
                            transition: 'all 0.2s ease',
                            width: '100%'
                          }}
                          onMouseEnter={(e) => {
                            e.target.style.color = '#005885';
                            e.target.style.transform = 'translateX(4px)';
                          }}
                          onMouseLeave={(e) => {
                            e.target.style.color = '#0077b5';
                            e.target.style.transform = 'translateX(0)';
                          }}
                        >
                          <span style={{
                            background: 'rgba(0, 119, 181, 0.1)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            marginRight: '0.5rem',
                            fontSize: '0.75rem'
                          }}>🔗</span>
                          <span className="flex-1">{profile.linkedin_url}</span>
                          <span style={{ fontSize: '0.75rem', marginLeft: '0.5rem' }}>↗️</span>
                        </a>
                      ) : (
                        <p className="text-gray-500 italic flex items-center">
                          <span style={{
                            background: 'rgba(107, 114, 128, 0.1)',
                            borderRadius: '6px',
                            padding: '0.25rem 0.5rem',
                            marginRight: '0.5rem',
                            fontSize: '0.75rem'
                          }}>🔗</span>
                          No LinkedIn profile added yet
                        </p>
                      )}
                    </div>
                  )}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>
      </div>
      </div>
    </div>
  );
};

export default ProfilePage;
