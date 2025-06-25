import React from 'react';

const Badge = ({
  children,
  variant = 'default',
  size = 'medium',
  className = '',
  ...props
}) => {
  let classes = 'badge';

  // Add variant classes
  if (variant === 'primary') classes += ' badge-primary';
  else if (variant === 'secondary') classes += ' badge-secondary';
  else if (variant === 'success') classes += ' badge-success';
  else if (variant === 'warning') classes += ' badge-warning';
  else if (variant === 'danger') classes += ' badge-danger';
  else if (variant === 'info') classes += ' badge-info';
  else classes += ' badge-secondary'; // default

  // Add size styles inline for now
  let sizeStyle = {};
  if (size === 'small') {
    sizeStyle = { padding: '0.125rem 0.5rem', fontSize: '0.75rem' };
  } else if (size === 'large') {
    sizeStyle = { padding: '0.375rem 0.75rem', fontSize: '1rem' };
  }

  // Add custom classes
  if (className) classes += ' ' + className;

  return (
    <span className={classes} style={sizeStyle} {...props}>
      {children}
    </span>
  );
};

export default Badge;
