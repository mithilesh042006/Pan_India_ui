import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/forms/RegisterForm';
import Card from '../components/ui/Card';
import { Star, UserPlus, Building, Award, CheckCircle } from 'lucide-react';

const RegisterPage = () => {
  const { register, isLoading } = useAuth();
  const navigate = useNavigate();

  const handleRegister = async (userData) => {
    try {
      await register(userData);
      navigate('/login');
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="animated-bg" style={{ minHeight: '100vh' }}>
      <div className="grid md:grid-cols-2 lg:grid-cols-5" style={{ minHeight: '100vh' }}>
        {/* Left Side - Benefits */}
        <div className="hidden md:flex lg:col-span-2 flex-col justify-center items-center p-8 lg:p-12 text-white">
          <div className="text-center max-w-lg">
            <div className="mb-8">
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'inline-block'
              }}>
                <UserPlus style={{ width: '4rem', height: '4rem' }} />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-6">
              Join Our Community
            </h1>

            <p className="text-xl mb-8 opacity-90">
              Connect with thousands of professionals and companies across India
            </p>

            {/* Why Join Section */}
            <div className="mb-8 p-6" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              textAlign: 'left'
            }}>
              <h3 className="text-xl font-semibold mb-4 text-center">Why Join Us?</h3>
              <ul className="space-y-3">
                <li className="flex items-center space-x-3">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1.5rem',
                    height: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem' }}>✓</span>
                  </div>
                  <span>Free to join and use</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1.5rem',
                    height: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem' }}>✓</span>
                  </div>
                  <span>Anonymous rating options</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1.5rem',
                    height: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem' }}>✓</span>
                  </div>
                  <span>Verified company profiles</span>
                </li>
                <li className="flex items-center space-x-3">
                  <div style={{
                    background: 'rgba(255, 255, 255, 0.3)',
                    borderRadius: '50%',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1.5rem',
                    height: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem' }}>✓</span>
                  </div>
                  <span>Career growth insights</span>
                </li>
              </ul>
            </div>

            <div className="space-y-6">
              <div className="flex items-start space-x-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <Building style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold mb-1">For Companies</h3>
                  <p className="opacity-90">Find and evaluate talented employees with verified ratings</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0,
                }}>
                  <Award style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold mb-1">For Employees</h3>
                  <p className="opacity-90">Rate your workplace experience and discover great companies</p>
                </div>
              </div>

              <div className="flex items-start space-x-4">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '0.75rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  flexShrink: 0
                }}>
                  <CheckCircle style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <div className="text-left">
                  <h3 className="text-lg font-semibold mb-1">Verified Reviews</h3>
                  <p className="opacity-90">All ratings are verified and authentic for maximum trust</p>
                </div>
              </div>
            </div>

            {/* Success Stories */}
            {/* <div className="mb-6 p-6" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)',
              textAlign: 'left'
            }}>
              <h3 className="text-lg font-semibold mb-3 text-center">Success Stories</h3>
              <div className="space-y-3 text-sm">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.75rem'
                }}>
                  <p className="italic">"Found my dream job through company ratings and reviews!"</p>
                  <p className="text-xs opacity-75 mt-1">- Priya S., Software Engineer</p>
                </div>
                <div style={{
                  background: 'rgba(255, 255, 255, 0.1)',
                  borderRadius: '8px',
                  padding: '0.75rem'
                }}>
                  <p className="italic">"Helped us hire the right talent with verified employee profiles."</p>
                  <p className="text-xs opacity-75 mt-1">- Rajesh K., HR Manager</p>
                </div>
              </div>
            </div> */}

            {/* Statistics */}
            {/* <div className="p-6" style={{
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              backdropFilter: 'blur(10px)'
            }}>
              <h3 className="text-lg font-semibold mb-4 text-center">Our Impact</h3>
              <div className="grid grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold">10K+</div>
                  <div className="text-sm opacity-90">Active Users</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">5K+</div>
                  <div className="text-sm opacity-90">Companies</div>
                </div>
                <div>
                  <div className="text-2xl font-bold">50K+</div>
                  <div className="text-sm opacity-90">Reviews</div>
                </div>
              </div>

              <div className="mt-4 pt-4" style={{ borderTop: '1px solid rgba(255, 255, 255, 0.2)' }}>
                <div className="grid grid-cols-2 gap-4 text-center text-sm">
                  <div>
                    <div className="text-lg font-bold">95%</div>
                    <div className="opacity-90">User Satisfaction</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold">24/7</div>
                    <div className="opacity-90">Support Available</div>
                  </div>
                </div>
              </div>
            </div> */}
          </div>
        </div>

        {/* Right Side - Registration Form */}
        <div className="lg:col-span-3 flex flex-col justify-center items-center p-8 bg-white" style={{ overflowY: 'auto' }}>
          <div style={{ width: '100%', maxWidth: '500px' }}>
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-6">
              <div style={{
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                borderRadius: '16px',
                padding: '1rem',
                display: 'inline-block',
                marginBottom: '1rem'
              }}>
                <Star style={{ width: '2rem', height: '2rem', color: 'white' }} />
              </div>
              <h2 className="text-2xl font-bold text-gray-900">Pan-India Rating Portal</h2>
              <p className="text-gray-600 mt-2">Connect with thousands of professionals and companies across India</p>

              {/* Mobile Benefits */}
              <div className="mt-4 p-4" style={{
                background: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <h3 className="text-sm font-semibold text-gray-900 mb-3">Why Join Us?</h3>
                <div className="space-y-2 text-xs text-left">
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#667eea' }}>✓</span>
                    <span className="text-gray-700">Free to join and use</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#667eea' }}>✓</span>
                    <span className="text-gray-700">Anonymous rating options</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span style={{ color: '#667eea' }}>✓</span>
                    <span className="text-gray-700">Verified company profiles</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs mt-4 pt-3" style={{ borderTop: '1px solid #e2e8f0' }}>
                  <div>
                    <div className="text-lg font-bold text-blue-600">10K+</div>
                    <div className="text-gray-600">Users</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">5K+</div>
                    <div className="text-gray-600">Companies</div>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-blue-600">50K+</div>
                    <div className="text-gray-600">Reviews</div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Create Your Account
              </h2>
              <p className="text-gray-600">
                Join thousands of professionals and companies
              </p>

              {/* Benefits visible on all screens */}
              <div className="mt-6 p-4" style={{
                background: 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%)',
                borderRadius: '12px',
                border: '1px solid #e2e8f0'
              }}>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div className="flex flex-col items-center">
                    <div style={{
                      background: '#667eea',
                      borderRadius: '50%',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <Building style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">For Companies</div>
                    <div className="text-xs text-gray-600">Find talented employees</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div style={{
                      background: '#667eea',
                      borderRadius: '50%',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <Award style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">For Employees</div>
                    <div className="text-xs text-gray-600">Rate your workplace</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <div style={{
                      background: '#667eea',
                      borderRadius: '50%',
                      padding: '0.5rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      marginBottom: '0.5rem'
                    }}>
                      <CheckCircle style={{ width: '1.25rem', height: '1.25rem', color: 'white' }} />
                    </div>
                    <div className="text-sm font-semibold text-gray-900">Verified</div>
                    <div className="text-xs text-gray-600">Authentic reviews</div>
                  </div>
                </div>
              </div>
            </div>

            <Card style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: 'none'
            }}>
              <div className="p-8">
                <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
              </div>
            </Card>

            <div className="text-center mt-6">
              <p className="text-sm text-gray-500">
                By creating an account, you agree to our{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="text-blue-600 hover:text-blue-800">Privacy Policy</a>
              </p>
            </div>

            <div className="text-center mt-4">
              <p className="text-sm text-gray-500">
                © 2024 Pan-India Rating Portal. All rights reserved.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
