import React from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  hoverEffect?: boolean;
}

export function Card({ children, className, hoverEffect = false, ...props }: CardProps) {
  return (
    <div
      className={twMerge(
        clsx(
          'bg-card text-card-foreground border border-border rounded-2xl p-6 shadow-xs transition-all duration-200',
          hoverEffect && 'hover:border-primary/40 hover:shadow-md',
          className
        )
      )}
      {...props}
    >
      {children}
    </div>
  );
}
