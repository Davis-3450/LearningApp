import React from 'react';
import { cn } from '@/lib/utils';

interface GameLayoutProps {
  children: React.ReactNode;
  className?: string;
}

export const GameLayout: React.FC<GameLayoutProps> = ({ children, className }) => {
  return (
    <div className={cn('min-h-screen bg-gray-50 dark:bg-gray-900', className)}>
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {children}
      </div>
    </div>
  );
};