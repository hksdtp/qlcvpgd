// Liquid Glass Button Component
// Apple Mail iOS 26 inspired design

import React from 'react';

interface GlassButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
  className?: string;
  icon?: React.ReactNode;
}

const GlassButton: React.FC<GlassButtonProps> = ({
  children,
  onClick,
  variant = 'secondary',
  size = 'md',
  disabled = false,
  className = '',
  icon,
}) => {
  const variants = {
    primary: `
      bg-apple-blue text-white
      hover:bg-apple-blue-dark
      active:scale-95
      shadow-apple
    `,
    secondary: `
      bg-white/70 backdrop-blur-xl
      border border-white/20
      text-light-text
      hover:bg-white/85
      active:scale-95
      shadow-glass
    `,
    ghost: `
      bg-transparent
      text-light-text-secondary
      hover:bg-white/50
      active:scale-95
    `,
    danger: `
      bg-red-500/80 backdrop-blur-xl
      text-white
      hover:bg-red-600/90
      active:scale-95
      shadow-glass
    `,
  };

  const sizes = {
    sm: 'px-3 py-1.5 text-sm rounded-lg',
    md: 'px-4 py-2 text-base rounded-xl',
    lg: 'px-6 py-3 text-lg rounded-2xl',
  };

  const disabledClass = disabled
    ? 'opacity-50 cursor-not-allowed pointer-events-none'
    : '';

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${variants[variant]}
        ${sizes[size]}
        ${disabledClass}
        font-medium
        transition-all duration-200
        flex items-center gap-2
        ${className}
      `}
    >
      {icon && <span className="flex-shrink-0">{icon}</span>}
      {children}
    </button>
  );
};

export default GlassButton;

