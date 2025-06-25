import React from 'react';
import { getInitials, getAvatarColor } from '../../utils/helpers';

const Avatar = ({ 
  src, 
  alt, 
  name, 
  size = 'medium',
  className = '',
  ...props 
}) => {
  const sizes = {
    small: 'w-8 h-8 text-sm',
    medium: 'w-12 h-12 text-base',
    large: 'w-16 h-16 text-lg',
    xl: 'w-24 h-24 text-2xl',
  };

  const sizeClass = sizes[size] || sizes.medium;

  if (src) {
    return (
      <img
        src={src}
        alt={alt || name}
        className={`${sizeClass} rounded-full object-cover ${className}`}
        {...props}
      />
    );
  }

  return (
    <div
      className={`${sizeClass} rounded-full flex items-center justify-center text-white font-bold ${getAvatarColor(name || 'User')} ${className}`}
      {...props}
    >
      {getInitials(name || 'User')}
    </div>
  );
};

export default Avatar;
