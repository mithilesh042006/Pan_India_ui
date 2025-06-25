import React from 'react';

const Card = ({
  children,
  className = '',
  padding = 'medium',
  shadow = 'medium',
  hover = false,
  ...props
}) => {
  let classes = 'card';

  // Add padding
  if (padding === 'small') classes += ' p-3';
  else if (padding === 'medium') classes += ' p-6';
  else if (padding === 'large') classes += ' p-8';

  // Add shadow
  if (shadow === 'small') classes += ' shadow';
  else if (shadow === 'medium') classes += ' shadow-md';
  else if (shadow === 'large') classes += ' shadow-lg';

  // Add hover effect
  if (hover) classes += ' card-hover';

  // Add custom classes
  if (className) classes += ' ' + className;

  return (
    <div className={classes} {...props}>
      {children}
    </div>
  );
};

// Card Header component
Card.Header = ({ children, className = '' }) => (
  <div className={`border-b border-gray-200 pb-4 mb-4 ${className}`}>
    {children}
  </div>
);

// Card Body component
Card.Body = ({ children, className = '' }) => (
  <div className={className}>
    {children}
  </div>
);

// Card Footer component
Card.Footer = ({ children, className = '' }) => (
  <div className={`border-t border-gray-200 pt-4 mt-4 ${className}`}>
    {children}
  </div>
);

export default Card;
