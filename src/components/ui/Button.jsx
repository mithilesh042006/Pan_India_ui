import React from 'react';

const Button = ({
  children,
  variant = 'primary',
  size = 'medium',
  disabled = false,
  loading = false,
  onClick,
  type = 'button',
  className = '',
  ...props
}) => {
  let classes = 'btn';

  // Add variant classes
  if (variant === 'primary') classes += ' btn-primary';
  else if (variant === 'secondary') classes += ' btn-secondary';
  else if (variant === 'outline') classes += ' btn-outline';
  else if (variant === 'danger') classes += ' btn-danger';

  // Add size classes
  if (size === 'small') classes += ' btn-small';
  else if (size === 'large') classes += ' btn-large';

  // Add custom classes
  if (className) classes += ' ' + className;

  return (
    <button
      type={type}
      className={classes}
      disabled={disabled || loading}
      onClick={onClick}
      {...props}
    >
      {loading && (
        <div className="spinner w-4 h-4 mr-2" style={{ width: '1rem', height: '1rem', marginRight: '0.5rem' }}></div>
      )}
      {children}
    </button>
  );
};

export default Button;
