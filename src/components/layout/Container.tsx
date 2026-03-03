import React from 'react';
import { cn } from '@/lib/utils';

interface ContainerProps {
  children: React.ReactNode;
  className?: string;
  maxWidth?: 'mobile' | 'tablet' | 'desktop';
}

export function Container({ 
  children, 
  className, 
  maxWidth = 'desktop' 
}: ContainerProps) {
  const maxWidthClasses = {
    mobile: 'max-w-full',
    tablet: 'max-w-tablet',
    desktop: 'max-w-desktop',
  };

  return (
    <div
      className={cn(
        'container-responsive mx-auto',
        maxWidthClasses[maxWidth],
        className
      )}
    >
      {children}
    </div>
  );
}
