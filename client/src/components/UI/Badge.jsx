import React from 'react';

const variants = {
  PRO: 'bg-purple-900/50 text-purple-300 border border-purple-700',
  FREE: 'bg-slate-700 text-slate-300 border border-transparent',
  ADMIN: 'bg-amber-900/50 text-amber-300 border border-amber-700',
  Easy: 'bg-emerald-900/50 text-emerald-300 border border-transparent',
  Medium: 'bg-amber-900/50 text-amber-300 border border-transparent',
  Hard: 'bg-red-900/50 text-red-300 border border-transparent',
  Completed: 'bg-emerald-900/50 text-emerald-300 border border-transparent',
  New: 'bg-indigo-900/50 text-indigo-300 border border-transparent',
};

export default function Badge({ children, variant = 'FREE', className = '' }) {
  const baseClasses = 'inline-flex items-center rounded-full px-2.5 py-0.5 text-[11px] font-semibold';
  
  // If variant is not in our list, fallback to FREE styling
  const styleClass = variants[variant] || variants.FREE;
  
  return (
    <span className={`${baseClasses} ${styleClass} ${className}`}>
      {children}
    </span>
  );
}
