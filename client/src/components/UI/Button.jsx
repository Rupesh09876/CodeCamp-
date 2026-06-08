import React from 'react';

const variants = {
  primary: 'bg-gradient-primary text-white hover:opacity-90',
  pro: 'bg-gradient-to-r from-purple-600 to-pink-500 text-white hover:opacity-90',
  admin: 'bg-amber-600 hover:bg-amber-700 text-white',
  success: 'bg-green-500 hover:bg-green-600 text-white',
  danger: 'bg-red-500 hover:bg-red-600 text-white',
  ghost: 'bg-transparent border border-[var(--color-ui-border)] hover:bg-[var(--color-surface)] text-white',
  outline: 'bg-transparent border border-white hover:bg-white hover:text-black text-white',
};

export default function Button({ children, variant = 'primary', className = '', ...props }) {
  const baseClasses = 'inline-flex items-center justify-center rounded-full px-6 py-2.5 text-[14px] font-semibold transition-all duration-200 hover:scale-105 active:scale-95 focus:outline-none focus:ring-2 focus:ring-[var(--color-primary)] focus:ring-offset-2 focus:ring-offset-[var(--color-base)] disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100';
  
  return (
    <button className={`${baseClasses} ${variants[variant] || variants.primary} ${className}`} {...props}>
      {children}
    </button>
  );
}
