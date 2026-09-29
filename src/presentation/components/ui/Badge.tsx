import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface BadgeProps extends React.HTMLAttributes<HTMLSpanElement> {
  variant?: 'success' | 'warning' | 'error' | 'info' | 'neutral';
  children: React.ReactNode;
}

export function Badge({ variant = 'neutral', className, children, ...props }: BadgeProps) {
  const variantStyles = {
    success: 'bg-accent-green/10 text-accent-green border-accent-green/20',
    warning: 'bg-accent-orange/10 text-accent-orange border-accent-orange/20',
    error: 'bg-accent-red/10 text-accent-red border-accent-red/20',
    info: 'bg-primary/10 text-primary border-primary/20',
    neutral: 'bg-secondary/10 text-secondary border-border',
  };

  return (
    <span
      className={twMerge(
        clsx(
          'inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-medium border transition-colors',
          variantStyles[variant],
          className
        )
      )}
      {...props}
    >
      {children}
    </span>
  );
}
