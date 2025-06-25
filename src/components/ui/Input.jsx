import React, { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  error,
  type = 'text',
  placeholder,
  className = '',
  required = false,
  disabled = false,
  ...props
}, ref) => {
  let inputClasses = 'input-field';
  if (error) inputClasses += ' input-error';
  if (className) inputClasses += ' ' + className;

  return (
    <div className="w-full">
      {label && (
        <label className="block text-sm font-medium text-gray-700 mb-2">
          {label}
          {required && <span className="text-red-600 ml-2">*</span>}
        </label>
      )}

      <input
        ref={ref}
        type={type}
        placeholder={placeholder}
        className={inputClasses}
        disabled={disabled}
        style={disabled ? { backgroundColor: '#f3f4f6', cursor: 'not-allowed' } : {}}
        {...props}
      />

      {error && (
        <p className="mt-2 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;
