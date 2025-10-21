// Liquid Glass Input Component
// Apple Mail iOS 26 inspired design

import React from 'react';

interface GlassInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: 'text' | 'email' | 'password' | 'search';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
  onFocus?: () => void;
  onBlur?: () => void;
}

const GlassInput: React.FC<GlassInputProps> = ({
  value,
  onChange,
  placeholder = '',
  type = 'text',
  disabled = false,
  className = '',
  icon,
  onFocus,
  onBlur,
}) => {
  return (
    <div className={`relative ${className}`}>
      {icon && (
        <div className="absolute left-3 top-1/2 -translate-y-1/2 text-light-text-secondary">
          {icon}
        </div>
      )}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
        onFocus={onFocus}
        onBlur={onBlur}
        className={`
          w-full
          ${icon ? 'pl-10' : 'pl-4'}
          pr-4 py-2.5
          bg-white/70 backdrop-blur-xl
          border border-white/20
          rounded-xl
          text-light-text
          placeholder:text-light-text-secondary/50
          focus:bg-white/85
          focus:border-apple-blue/50
          focus:outline-none
          focus:ring-2
          focus:ring-apple-blue/20
          transition-all duration-200
          disabled:opacity-50
          disabled:cursor-not-allowed
          shadow-glass
        `}
      />
    </div>
  );
};

export default GlassInput;

