import React from 'react';
import { Card } from './card';
import { cn } from '@/lib/utils';

interface CardGridProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactNode;
  cols?: 1 | 2 | 3 | 4;
}

interface CardGridItemProps extends React.ComponentProps<typeof Card> {
  children: React.ReactNode;
}

const CardGrid: React.FC<CardGridProps> & { Item: React.FC<CardGridItemProps> } = ({ 
  children, 
  className,
  cols = 3,
  ...props 
}) => {
  const gridCols = {
    1: 'grid-cols-1',
    2: 'grid-cols-1 sm:grid-cols-2',
    3: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4',
  };

  return (
    <div 
      className={cn('grid gap-4 sm:gap-6', gridCols[cols], className)} 
      {...props}
    >
      {children}
    </div>
  );
};

const CardGridItem: React.FC<CardGridItemProps> = ({ 
  children, 
  className, 
  ...props 
}) => (
  <Card 
    className={cn('hover:shadow-lg transition-all hover:scale-[1.02] h-full', className)} 
    {...props}
  >
    {children}
  </Card>
);

CardGrid.Item = CardGridItem;

export { CardGrid };