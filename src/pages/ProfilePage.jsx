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
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Profile Settings</h1>
        <p className="mt-2 text-gray-600">Manage your account information and preferences</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Profile Overview */}
        <div className="lg:col-span-1">
          <Card>
            <Card.Body className="text-center">
              <div className="mb-4">
                {profile?.avatar ? (
                  <img
                    src={profile.avatar}
                    alt={profile.full_name}
                    className="w-24 h-24 rounded-full mx-auto object-cover"
                  />
                ) : (
                  <div className={`w-24 h-24 rounded-full mx-auto flex items-center justify-center text-white text-2xl font-bold ${getAvatarColor(profile?.full_name || 'User')}`}>
                    {getInitials(profile?.full_name || 'User')}
                  </div>
                )}
              </div>

              <h3 className="text-xl font-semibold text-gray-900 mb-1">
                {profile?.full_name}
              </h3>

              <Badge variant="primary" className="mb-4">
                {profile?.user_role === 'employee' ? 'Employee' : 'Employer'}
              </Badge>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center justify-center">
                  <Mail className="w-4 h-4 mr-2" />
                  {profile?.email}
                </div>

                <div className="flex items-center justify-center">
                  <MapPin className="w-4 h-4 mr-2" />
                  {profile?.city}
                </div>

                <div className="flex items-center justify-center">
                  <Star className="w-4 h-4 mr-2" />
                  {profile?.rating_received ? `${profile.rating_received.toFixed(1)} Rating` : 'No ratings yet'}
                </div>

                <div className="flex items-center justify-center">
                  <Calendar className="w-4 h-4 mr-2" />
                  Joined {formatDate(profile?.date_joined)}
                </div>
              </div>
            </Card.Body>
          </Card>
        </div>

        {/* Profile Details */}
        <div className="lg:col-span-2">
          <Card>
            <Card.Header className="flex justify-between items-center">
              <h3 className="text-lg font-semibold text-gray-900">Profile Information</h3>
              <Button
                variant="outline"
                size="small"
                onClick={isEditing ? handleSave : handleEditToggle}
                className="flex items-center"
              >
                {isEditing ? (
                  <>
                    <Save className="w-4 h-4 mr-1" />
                    Save
                  </>
                ) : (
                  <>
                    <Edit3 className="w-4 h-4 mr-1" />
                    Edit
                  </>
                )}
              </Button>
              {isEditing && (
                <Button
                  variant="secondary"
                  size="small"
                  onClick={handleEditToggle}
                  className="flex items-center ml-2"
                >
                  <X className="w-4 h-4 mr-1" />
                  Cancel
                </Button>
              )}
            </Card.Header>

            <Card.Body>
              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Full Name
                    </label>
                    {isEditing ? (
                      <Input
                        name="full_name"
                        value={editForm.full_name}
                        onChange={handleInputChange}
                        placeholder="Enter your full name"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.full_name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Email Address
                    </label>
                    <p className="text-gray-900">{profile?.email}</p>
                    <p className="text-xs text-gray-500 mt-1">Email cannot be changed</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      City
                    </label>
                    {isEditing ? (
                      <Input
                        name="city"
                        value={editForm.city}
                        onChange={handleInputChange}
                        placeholder="Enter your city"
                      />
                    ) : (
                      <p className="text-gray-900">{profile?.city}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      User Role
                    </label>
                    <p className="text-gray-900 capitalize">{profile?.user_role}</p>
                    <p className="text-xs text-gray-500 mt-1">Role cannot be changed</p>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {profile?.user_role === 'employer' ? 'Services/Industry' : 'Skills'}
                  </label>
                  {isEditing ? (
                    <Input
                      name="skills"
                      value={editForm.skills}
                      onChange={handleInputChange}
                      placeholder={profile?.user_role === 'employer' ? 'e.g., Software Development, Consulting' : 'e.g., Python, React, Node.js (comma separated)'}
                    />
                  ) : (
                    <div className="flex flex-wrap gap-2">
                      {profile?.skills?.map((skill, index) => (
                        <Badge key={index} variant="secondary">
                          {skill}
                        </Badge>
                      ))}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    LinkedIn URL
                  </label>
                  {isEditing ? (
                    <Input
                      name="linkedin_url"
                      value={editForm.linkedin_url}
                      onChange={handleInputChange}
                      placeholder="https://linkedin.com/in/yourprofile"
                    />
                  ) : (
                    <div>
                      {profile?.linkedin_url ? (
                        <a
                          href={profile.linkedin_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-600 hover:text-blue-800 underline"
                        >
                          {profile.linkedin_url}
                        </a>
                      ) : (
                        <p className="text-gray-500">No LinkedIn profile added</p>
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
  );
};

export default ProfilePage;
