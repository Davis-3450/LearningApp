import React from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';

interface GameHeaderProps {
  deck: Deck;
  onReset: () => void;
  gameType?: string;
}

export const GameHeader: React.FC<GameHeaderProps> = ({ 
  deck, 
  onReset, 
  gameType = 'Game' 
}) => {
  const router = useRouter();

  return (
    <div className="flex items-center justify-between mb-4 sm:mb-6">
      <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
        <Button 
          variant="ghost" 
          onClick={() => router.push('/decks')} 
          size="sm"
          aria-label="Back to decks"
        >
          <ArrowLeft className="h-4 w-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
            {deck.title}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            {gameType}
          </p>
        </div>
      </div>
      <Button 
        variant="outline" 
        onClick={onReset} 
        size="sm" 
        className="ml-2"
        aria-label="Reset game"
      >
        <RotateCcw className="mr-2 h-4 w-4" />
        <span className="hidden sm:inline">Reset</span>
      </Button>
    </div>
  );
};