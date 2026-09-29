import React, { forwardRef } from 'react';
import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: React.ReactNode;
  prefixSymbol?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, icon, prefixSymbol, className, ...props }, ref) => {
    return (
      <div className="w-full space-y-1.5">
        {label && (
          <label className="block text-xs font-medium text-foreground">
            {label}
          </label>
        )}
        <div className="relative flex items-center">
          {prefixSymbol && (
            <span className="absolute left-3.5 text-muted font-semibold text-sm select-none pointer-events-none">
              {prefixSymbol}
            </span>
          )}
          {icon && !prefixSymbol && (
            <span className="absolute left-3.5 text-muted pointer-events-none">
              {icon}
            </span>
          )}
          <input
            ref={ref}
            className={twMerge(
              clsx(
                'w-full bg-card border border-border rounded-xl text-foreground placeholder:text-muted/60 text-sm py-2.5 px-3.5 focus:outline-none focus:ring-2 focus:ring-primary/40 focus:border-primary transition-all duration-200',
                prefixSymbol && 'pl-8',
                icon && !prefixSymbol && 'pl-10',
                error && 'border-accent-red focus:ring-accent-red/40 focus:border-accent-red',
                className
              )
            )}
            {...props}
          />
        </div>
        {error && <p className="text-xs text-accent-red font-medium mt-1">{error}</p>}
      </div>
    );
  }
);

Input.displayName = 'Input';
