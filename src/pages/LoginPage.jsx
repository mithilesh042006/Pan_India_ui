import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import LoginForm from '../components/forms/LoginForm';
import Card from '../components/ui/Card';
import { Star, Shield, Users, TrendingUp } from 'lucide-react';

const LoginPage = () => {
  const { login, isLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/dashboard';

  const handleLogin = async (credentials) => {
    try {
      await login(credentials);
      navigate(from, { replace: true });
    } catch (error) {
      // Error is handled by the auth context
    }
  };

  return (
    <div className="animated-bg" style={{ minHeight: '100vh' }}>
      <div className="grid md:grid-cols-2" style={{ minHeight: '100vh' }}>
        {/* Left Side - Branding */}
        <div className="hidden md:flex flex-col justify-center items-center p-8 lg:p-12 text-white">
          <div className="text-center max-w-md">
            <div className="mb-8">
              <div style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                borderRadius: '20px',
                padding: '2rem',
                display: 'inline-block'
              }}>
                <Star style={{ width: '4rem', height: '4rem' }} />
              </div>
            </div>

            <h1 className="text-4xl font-bold mb-6">
              Pan-India Rating Portal
            </h1>

            <p className="text-xl mb-8 opacity-90">
              Building trust through transparent employee and employer ratings across India
            </p>

            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Shield style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <span className="text-lg">Secure & Anonymous Ratings</span>
              </div>

              <div className="flex items-center space-x-3">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <Users style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <span className="text-lg">Connect with Professionals</span>
              </div>

              <div className="flex items-center space-x-3">
                <div style={{
                  background: 'rgba(255, 255, 255, 0.2)',
                  borderRadius: '50%',
                  padding: '0.5rem',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center'
                }}>
                  <TrendingUp style={{ width: '1.5rem', height: '1.5rem' }} />
                </div>
                <span className="text-lg">Grow Your Career</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="flex flex-col justify-center items-center p-8 bg-white">
          <div style={{ width: '100%', maxWidth: '400px' }}>
            {/* Mobile Logo */}
            <div className="md:hidden text-center mb-8">
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
            </div>

            <div className="text-center mb-8">
              <h2 className="text-3xl font-bold text-gray-900 mb-2">
                Welcome Back
              </h2>
              <p className="text-gray-600">
                Sign in to access your account
              </p>
            </div>

            <Card style={{
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
              border: 'none'
            }}>
              <div className="p-8">
                <LoginForm onSubmit={handleLogin} isLoading={isLoading} />
              </div>
            </Card>

            {/* Additional Info for Desktop */}
            <div className="hidden md:block mt-8 p-6" style={{
              background: '#f8fafc',
              borderRadius: '12px',
              border: '1px solid #e2e8f0'
            }}>
              <h3 className="text-lg font-semibold text-gray-900 mb-3">Quick Access</h3>
              <div className="space-y-3 text-sm text-gray-600">
                <div className="flex items-center space-x-3">
                  <div style={{
                    background: '#667eea',
                    borderRadius: '50%',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1.5rem',
                    height: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'white' }}>1</span>
                  </div>
                  <span>Rate companies and employers</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div style={{
                    background: '#667eea',
                    borderRadius: '50%',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1.5rem',
                    height: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'white' }}>2</span>
                  </div>
                  <span>Browse verified reviews</span>
                </div>
                <div className="flex items-center space-x-3">
                  <div style={{
                    background: '#667eea',
                    borderRadius: '50%',
                    padding: '0.25rem',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    minWidth: '1.5rem',
                    height: '1.5rem'
                  }}>
                    <span style={{ fontSize: '0.75rem', color: 'white' }}>3</span>
                  </div>
                  <span>Connect with professionals</span>
                </div>
              </div>
            </div>

            <div className="text-center mt-6">
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

export default LoginPage;
