import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { Menu, X, LogOut, Settings, Star, ChevronDown } from 'lucide-react';

const Header = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const toggleProfileMenu = () => {
    setIsProfileMenuOpen(!isProfileMenuOpen);
  };

  return (
    <header className="bg-white shadow-lg border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo and Brand */}
          <div className="flex items-center">
            <Link to="/dashboard" className="flex items-center space-x-2">
              <div className="bg-blue-600 text-white p-2 rounded-lg">
                <Star className="w-6 h-6" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900">Pan India</h1>
                <p className="text-xs text-gray-500">Rating Portal</p>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link
              to="/dashboard"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              Dashboard
            </Link>
            
            {user?.user_role === 'employee' && (
              <Link
                to="/companies"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Companies
              </Link>
            )}
            
            {user?.user_role === 'employer' && (
              <Link
                to="/employees"
                className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
              >
                Employees
              </Link>
            )}
            
            <Link
              to="/ratings"
              className="text-gray-700 hover:text-blue-600 px-3 py-2 rounded-md text-sm font-medium transition-colors"
            >
              My Ratings
            </Link>
          </nav>

          {/* User Profile Menu */}
          <div className="relative">
            {/* Backdrop overlay when dropdown is open */}
            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'fixed',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                  background: 'rgba(0, 0, 0, 0.1)',
                  backdropFilter: 'blur(2px)',
                  zIndex: 40
                }}
                onClick={() => setIsProfileMenuOpen(false)}
              />
            )}
            <button
              onClick={toggleProfileMenu}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                color: '#374151',
                background: 'rgba(59, 130, 246, 0.05)',
                border: '1px solid rgba(59, 130, 246, 0.1)',
                borderRadius: '12px',
                padding: '0.5rem 0.75rem',
                transition: 'all 0.2s ease',
                cursor: 'pointer'
              }}
              className="profile-button"
              onMouseEnter={(e) => {
                e.target.style.background = 'rgba(59, 130, 246, 0.1)';
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.2)';
                e.target.style.transform = 'scale(1.02)';
              }}
              onMouseLeave={(e) => {
                e.target.style.background = 'rgba(59, 130, 246, 0.05)';
                e.target.style.borderColor = 'rgba(59, 130, 246, 0.1)';
                e.target.style.transform = 'scale(1)';
              }}
            >
              <div style={{ position: 'relative' }}>
                <div style={{
                  width: '2.5rem',
                  height: '2.5rem',
                  background: user?.avatar ? 'transparent' : 'linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%)',
                  borderRadius: '10px',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '0.875rem',
                  fontWeight: '600',
                  color: 'white',
                  overflow: 'hidden'
                }}>
                  {user?.avatar ? (
                    <img
                      src={user.avatar}
                      alt={user.full_name}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover',
                        borderRadius: '10px'
                      }}
                    />
                  ) : (
                    user?.full_name?.charAt(0)?.toUpperCase() || 'U'
                  )}
                </div>
                {/* Online status indicator */}
                <div style={{
                  position: 'absolute',
                  bottom: '-2px',
                  right: '-2px',
                  width: '12px',
                  height: '12px',
                  background: '#10b981',
                  borderRadius: '50%',
                  border: '2px solid white',
                  boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)'
                }}></div>
              </div>
              <div className="hidden md:block">
                <div style={{ fontSize: '0.875rem', fontWeight: '500', lineHeight: '1.2', color: '#111827' }}>
                  {user?.full_name}
                </div>
                <div style={{ fontSize: '0.75rem', color: '#6b7280', lineHeight: '1.2' }}>
                  {user?.user_role?.charAt(0)?.toUpperCase() + user?.user_role?.slice(1) || 'User'}
                </div>
              </div>
              <ChevronDown
                style={{
                  width: '1rem',
                  height: '1rem',
                  color: '#6b7280',
                  transform: isProfileMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s ease'
                }}
              />
            </button>

            {/* Profile Dropdown */}
            {isProfileMenuOpen && (
              <div
                style={{
                  position: 'absolute',
                  right: '0',
                  marginTop: '0.75rem',
                  width: '280px',
                  background: 'white',
                  borderRadius: '16px',
                  boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
                  border: '1px solid #e5e7eb',
                  zIndex: 50,
                  overflow: 'hidden',
                  animation: 'slideDown 0.2s ease-out'
                }}
              >
                {/* User Info Section */}
                <div style={{
                  background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                  padding: '1.5rem 1rem',
                  color: 'white',
                  position: 'relative',
                  overflow: 'hidden'
                }}>
                  <div style={{
                    position: 'absolute',
                    top: '-20px',
                    right: '-20px',
                    width: '80px',
                    height: '80px',
                    background: 'rgba(255, 255, 255, 0.1)',
                    borderRadius: '50%'
                  }}></div>
                  <div style={{ position: 'relative', zIndex: 1 }}>
                    <div className="flex items-center space-x-3">
                      <div style={{
                        width: '48px',
                        height: '48px',
                        background: 'rgba(255, 255, 255, 0.2)',
                        borderRadius: '12px',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.25rem',
                        fontWeight: 'bold',
                        backdropFilter: 'blur(10px)'
                      }}>
                        {user?.full_name?.charAt(0)?.toUpperCase() || 'U'}
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{user?.full_name}</p>
                        <p className="text-xs opacity-90">{user?.email}</p>
                        <div style={{
                          display: 'inline-block',
                          background: 'rgba(255, 255, 255, 0.2)',
                          borderRadius: '12px',
                          padding: '0.25rem 0.5rem',
                          fontSize: '0.75rem',
                          fontWeight: '500',
                          marginTop: '0.25rem',
                          backdropFilter: 'blur(10px)'
                        }}>
                          {user?.user_role?.charAt(0)?.toUpperCase() + user?.user_role?.slice(1) || 'User'}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Menu Items */}
                <div style={{ padding: '0.5rem' }}>
                  <Link
                    to="/profile"
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      color: '#374151',
                      textDecoration: 'none',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                      marginBottom: '0.25rem'
                    }}
                    className="profile-menu-item"
                    onClick={() => setIsProfileMenuOpen(false)}
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #f3f4f6 0%, #e5e7eb 100%)';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem'
                    }}>
                      <Settings style={{ width: '1rem', height: '1rem', color: 'white' }} />
                    </div>
                    <div>
                      <div className="font-medium">Profile Settings</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Manage your account</div>
                    </div>
                  </Link>

                  <div style={{
                    height: '1px',
                    background: 'linear-gradient(90deg, transparent, #e5e7eb, transparent)',
                    margin: '0.5rem 0'
                  }}></div>

                  <button
                    onClick={handleLogout}
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      width: '100%',
                      padding: '0.75rem 1rem',
                      fontSize: '0.875rem',
                      color: '#dc2626',
                      background: 'transparent',
                      border: 'none',
                      borderRadius: '12px',
                      transition: 'all 0.2s ease',
                      cursor: 'pointer'
                    }}
                    className="logout-menu-item"
                    onMouseEnter={(e) => {
                      e.target.style.background = 'linear-gradient(135deg, #fef2f2 0%, #fee2e2 100%)';
                      e.target.style.transform = 'translateX(4px)';
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = 'transparent';
                      e.target.style.transform = 'translateX(0)';
                    }}
                  >
                    <div style={{
                      width: '32px',
                      height: '32px',
                      background: 'linear-gradient(135deg, #dc2626 0%, #b91c1c 100%)',
                      borderRadius: '8px',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginRight: '0.75rem'
                    }}>
                      <LogOut style={{ width: '1rem', height: '1rem', color: 'white' }} />
                    </div>
                    <div>
                      <div className="font-medium">Sign Out</div>
                      <div style={{ fontSize: '0.75rem', color: '#6b7280' }}>Logout from your account</div>
                    </div>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="text-gray-700 hover:text-blue-600 focus:outline-none"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden border-t border-gray-200 py-2">
            <div className="flex flex-col space-y-1">
              <Link
                to="/dashboard"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                Dashboard
              </Link>
              
              {user?.user_role === 'employee' && (
                <Link
                  to="/companies"
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Companies
                </Link>
              )}
              
              {user?.user_role === 'employer' && (
                <Link
                  to="/employees"
                  className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Employees
                </Link>
              )}
              
              <Link
                to="/ratings"
                className="text-gray-700 hover:text-blue-600 block px-3 py-2 rounded-md text-base font-medium"
                onClick={() => setIsMenuOpen(false)}
              >
                My Ratings
              </Link>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
