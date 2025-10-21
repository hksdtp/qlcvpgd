// Liquid Glass Card Component
// Apple Mail iOS 26 inspired design

import React from 'react';

interface GlassCardProps {
  children: React.ReactNode;
  className?: string;
  hover?: boolean;
  onClick?: () => void;
  variant?: 'default' | 'strong' | 'subtle';
}

const GlassCard: React.FC<GlassCardProps> = ({
  children,
  className = '',
  hover = false,
  onClick,
  variant = 'default',
}) => {
  const variants = {
    default: 'bg-white/70 backdrop-blur-xl border border-white/20',
    strong: 'bg-white/85 backdrop-blur-2xl border border-white/30',
    subtle: 'bg-white/50 backdrop-blur-lg border border-white/10',
  };

  const hoverClass = hover
    ? 'hover:bg-white/80 hover:shadow-glass-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer'
    : '';

  return (
    <div
      className={`
        ${variants[variant]}
        ${hoverClass}
        rounded-2xl shadow-glass
        ${className}
      `}
      onClick={onClick}
    >
      {children}
    </div>
  );
};

export default GlassCard;

