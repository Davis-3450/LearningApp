import React from 'react';
import { Progress } from '@/components/ui/progress';

interface GameProgressProps {
  current: number;
  total: number;
  score?: number;
  label?: string;
}

export const GameProgress: React.FC<GameProgressProps> = ({ 
  current, 
  total, 
  score,
  label = 'Progress'
}) => {
  const progress = total > 0 ? (current / total) * 100 : 0;

  return (
    <div className="mb-4 sm:mb-6">
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm text-gray-600 dark:text-gray-400">
          {label}: {current} of {total}
        </span>
        {score !== undefined && (
          <span className="text-sm text-gray-600 dark:text-gray-400">
            Score: {score}
          </span>
        )}
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  );
};