import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { Eye, EyeOff } from 'lucide-react';
import Button from '../ui/Button';
import Input from '../ui/Input';

// Validation schema
const schema = yup.object({
  email: yup
    .string()
    .email('Please enter a valid email address')
    .required('Email is required'),
  full_name: yup
    .string()
    .min(2, 'Full name must be at least 2 characters')
    .required('Full name is required'),
  password: yup
    .string()
    .min(8, 'Password must be at least 8 characters')
    .matches(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/,
      'Password must contain uppercase, lowercase, number and special character'
    )
    .required('Password is required'),
  password_confirm: yup
    .string()
    .oneOf([yup.ref('password')], 'Passwords must match')
    .required('Please confirm your password'),
  user_role: yup
    .string()
    .oneOf(['employee', 'employer'], 'Please select a valid role')
    .required('User role is required'),
  city: yup
    .string()
    .required('City is required'),
  skills: yup
    .string()
    .required('Skills are required'),
  linkedin_url: yup
    .string()
    .url('Please enter a valid LinkedIn URL')
    .optional(),
});

const RegisterForm = ({ onSubmit, isLoading = false }) => {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const userRole = watch('user_role');

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleFormSubmit = (data) => {
    // Convert skills string to array
    const formattedData = {
      ...data,
      skills: data.skills.split(',').map(skill => skill.trim()).filter(skill => skill),
    };
    onSubmit(formattedData);
  };

  const inputStyle = {
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    transition: 'all 0.2s ease'
  };

  const selectStyle = {
    borderRadius: '12px',
    border: '2px solid #e5e7eb',
    padding: '0.75rem 1rem',
    fontSize: '1rem',
    transition: 'all 0.2s ease',
    background: 'white'
  };

  return (
    <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Input
          label="Full Name"
          placeholder="Enter your full name"
          required
          error={errors.full_name?.message}
          {...register('full_name')}
          style={inputStyle}
        />

        <Input
          label="Email Address"
          type="email"
          placeholder="Enter your email address"
          required
          error={errors.email?.message}
          {...register('email')}
          style={inputStyle}
        />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="relative">
          <Input
            label="Password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Create a strong password"
            required
            error={errors.password?.message}
            {...register('password')}
            style={{...inputStyle, paddingRight: '3rem'}}
          />
          <button
            type="button"
            style={{
              position: 'absolute',
              right: '1rem',
              top: '2.25rem',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'color 0.2s ease'
            }}
            onClick={togglePasswordVisibility}
            onMouseEnter={(e) => e.target.style.color = '#6b7280'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
          >
            {showPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
          </button>
        </div>

        <div className="relative">
          <Input
            label="Confirm Password"
            type={showConfirmPassword ? 'text' : 'password'}
            placeholder="Confirm your password"
            required
            error={errors.password_confirm?.message}
            {...register('password_confirm')}
            style={{...inputStyle, paddingRight: '3rem'}}
          />
          <button
            type="button"
            style={{
              position: 'absolute',
              right: '1rem',
              top: '2.25rem',
              color: '#9ca3af',
              background: 'none',
              border: 'none',
              cursor: 'pointer',
              padding: '0.25rem',
              borderRadius: '4px',
              transition: 'color 0.2s ease'
            }}
            onClick={toggleConfirmPasswordVisibility}
            onMouseEnter={(e) => e.target.style.color = '#6b7280'}
            onMouseLeave={(e) => e.target.style.color = '#9ca3af'}
          >
            {showConfirmPassword ? <EyeOff style={{ width: '1.25rem', height: '1.25rem' }} /> : <Eye style={{ width: '1.25rem', height: '1.25rem' }} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            User Role <span className="text-red-600">*</span>
          </label>
          <select
            style={selectStyle}
            className="w-full"
            {...register('user_role')}
          >
            <option value="">Select your role</option>
            <option value="employee">Employee - Rate Companies</option>
            <option value="employer">Employer - Rate Employees</option>
          </select>
          {errors.user_role && (
            <p className="mt-2 text-sm text-red-600">{errors.user_role.message}</p>
          )}
        </div>

        <Input
          label="City"
          placeholder="Enter your city"
          required
          error={errors.city?.message}
          {...register('city')}
          style={inputStyle}
        />
      </div>

      <Input
        label={userRole === 'employer' ? 'Company Services/Industry' : 'Skills'}
        placeholder={userRole === 'employer' ? 'e.g., Software Development, Consulting' : 'e.g., Python, React, Node.js (comma separated)'}
        required
        error={errors.skills?.message}
        {...register('skills')}
        style={inputStyle}
      />

      <Input
        label="LinkedIn URL (Optional)"
        placeholder="https://linkedin.com/in/yourprofile"
        error={errors.linkedin_url?.message}
        {...register('linkedin_url')}
        style={inputStyle}
      />

      <Button
        type="submit"
        className="w-full"
        loading={isLoading}
        disabled={isLoading}
        style={{
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          border: 'none',
          borderRadius: '12px',
          padding: '0.875rem 1.5rem',
          fontSize: '1rem',
          fontWeight: '600',
          color: 'white',
          cursor: isLoading ? 'not-allowed' : 'pointer',
          transition: 'all 0.2s ease',
          boxShadow: '0 4px 14px 0 rgba(102, 126, 234, 0.3)'
        }}
        onMouseEnter={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(-1px)';
            e.target.style.boxShadow = '0 6px 20px 0 rgba(102, 126, 234, 0.4)';
          }
        }}
        onMouseLeave={(e) => {
          if (!isLoading) {
            e.target.style.transform = 'translateY(0)';
            e.target.style.boxShadow = '0 4px 14px 0 rgba(102, 126, 234, 0.3)';
          }
        }}
      >
        {isLoading ? 'Creating Account...' : 'Create Account'}
      </Button>

      <div className="text-center">
        <span className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link
            to="/login"
            style={{
              color: '#667eea',
              textDecoration: 'none',
              fontWeight: '600',
              transition: 'color 0.2s ease'
            }}
            onMouseEnter={(e) => e.target.style.color = '#5a67d8'}
            onMouseLeave={(e) => e.target.style.color = '#667eea'}
          >
            Sign in
          </Link>
        </span>
      </div>
    </form>
  );
};

export default RegisterForm;
