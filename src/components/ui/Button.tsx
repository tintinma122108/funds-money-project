import React from 'react';
import { cn } from '@/lib/utils';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'primary' | 'secondary' | 'success' | 'error' | 'warning' | 'info';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, ...props }, ref) => {
    const baseClasses = 'inline-flex items-center justify-center rounded-default font-medium transition-default focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none';
    
    const variants = {
      primary: 'bg-fuschia-100 text-white hover:bg-fuschia-80 focus:ring-fuschia-100',
      secondary: 'bg-iris-100 text-white hover:bg-iris-80 focus:ring-iris-100',
      success: 'bg-success text-white hover:bg-success/90 focus:ring-success',
      error: 'bg-error text-white hover:bg-error/90 focus:ring-error',
      warning: 'bg-warning text-white hover:bg-warning/90 focus:ring-warning',
      info: 'bg-info text-white hover:bg-info/90 focus:ring-info',
    };
    
    const sizes = {
      sm: 'h-8 px-3 text-sm',
      md: 'h-10 px-4 text-body',
      lg: 'h-12 px-6 text-base',
    };
    
    return (
      <button
        className={cn(
          baseClasses,
          variants[variant],
          sizes[size],
          className
        )}
        ref={ref}
        {...props}
      >
        {children}
      </button>
    );
  }
);

Button.displayName = 'Button';

export { Button };
