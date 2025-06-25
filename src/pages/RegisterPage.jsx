import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import RegisterForm from '../components/forms/RegisterForm';
import Card from '../components/ui/Card';
import { Star } from 'lucide-react';

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
    <div className="auth-container">
      <div style={{ margin: '0 auto', width: '100%', maxWidth: '48rem' }}>
        <div className="auth-header">
          <div className="auth-logo">
            <div className="logo-icon">
              <Star style={{ width: '2rem', height: '2rem' }} />
            </div>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            Create your account
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            Join the Pan-India Employee & Employer Rating Portal
          </p>
        </div>

        <Card padding="large">
          <RegisterForm onSubmit={handleRegister} isLoading={isLoading} />
        </Card>
      </div>
    </div>
  );
};

export default RegisterPage;
