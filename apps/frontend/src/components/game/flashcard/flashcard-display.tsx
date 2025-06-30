import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { Flashcard } from '@/shared/schemas/cards';

interface FlashcardDisplayProps {
  card: Flashcard;
  showAnswer: boolean;
  onFlip: () => void;
}

export const FlashcardDisplay: React.FC<FlashcardDisplayProps> = ({
  card,
  showAnswer,
  onFlip,
}) => {
  return (
    <div className="max-w-2xl mx-auto">
      <Card 
        className={cn(
          "min-h-[300px] sm:min-h-[400px] cursor-pointer transition-all duration-300",
          "hover:shadow-lg active:scale-95 focus-visible:ring-2 focus-visible:ring-ring"
        )}
        onClick={onFlip}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            onFlip();
          }
        }}
        tabIndex={0}
        role="button"
        aria-label={`Flashcard: ${showAnswer ? 'showing answer' : 'showing question'}. Press Enter or Space to flip.`}
        aria-pressed={showAnswer}
      >
        <CardContent className="p-6 sm:p-8 flex flex-col justify-center items-center text-center h-full min-h-[300px] sm:min-h-[400px]">
          <div className="mb-4">
            <Badge variant={showAnswer ? "default" : "secondary"}>
              {showAnswer ? "Answer" : "Question"}
            </Badge>
          </div>
          
          <div className="flex-1 flex items-center justify-center w-full">
            <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 dark:text-white break-words">
              {showAnswer ? card.data.back : card.data.front}
            </p>
          </div>

          <div className="mt-6 flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                onFlip();
              }}
              aria-label={showAnswer ? "Hide answer" : "Show answer"}
            >
              {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              <span className="ml-2 hidden sm:inline">
                {showAnswer ? "Hide" : "Show"} Answer
              </span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Mobile Tap Hint */}
      <div className="text-center mt-4 sm:hidden">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          Tap card to flip
        </p>
      </div>
    </div>
  );
};