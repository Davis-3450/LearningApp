'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';
import type { Flashcard } from '@/shared/schemas/cards';

interface FlashcardPlayerProps {
  deck: Deck;
  flashcards: Flashcard[];
}

export function FlashcardPlayer({ deck, flashcards }: FlashcardPlayerProps) {
  const router = useRouter();
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  const currentCard = flashcards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / flashcards.length) * 100;

  const nextCard = () => {
    if (currentCardIndex < flashcards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    }
  };

  const prevCard = () => {
    if (currentCardIndex > 0) {
      setCurrentCardIndex(currentCardIndex - 1);
      setShowAnswer(false);
    }
  };

  const resetSession = () => {
    setCurrentCardIndex(0);
    setShowAnswer(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button variant="ghost" onClick={() => router.push('/')} size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {deck.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Flashcard Study Mode
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={resetSession} size="sm" className="ml-2">
            <RotateCcw className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Card {currentCardIndex + 1} of {flashcards.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {Math.round(progress)}% Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Flashcard */}
        <div className="max-w-2xl mx-auto">
          <Card 
            className="min-h-[300px] sm:min-h-[400px] cursor-pointer transition-transform active:scale-95" 
            onClick={() => setShowAnswer(!showAnswer)}
          >
            <CardContent className="p-6 sm:p-8 flex flex-col justify-center items-center text-center h-full min-h-[300px] sm:min-h-[400px]">
              <div className="mb-4">
                <Badge variant={showAnswer ? "default" : "secondary"}>
                  {showAnswer ? "Answer" : "Question"}
                </Badge>
              </div>
              
              <div className="flex-1 flex items-center justify-center w-full">
                <p className="text-lg sm:text-xl md:text-2xl font-medium text-gray-900 dark:text-white break-words">
                  {showAnswer ? currentCard.data.back : currentCard.data.front}
                </p>
              </div>

              <div className="mt-6 flex items-center gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={(e) => {
                    e.stopPropagation();
                    setShowAnswer(!showAnswer);
                  }}
                >
                  {showAnswer ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  <span className="ml-2 hidden sm:inline">
                    {showAnswer ? "Hide" : "Show"} Answer
                  </span>
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center mt-4 sm:mt-6">
            <div className="flex items-center justify-between w-full max-w-xs">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentCardIndex === 0}
                size="sm"
              >
                <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
                <span className="hidden sm:inline">Previous</span>
                <span className="sm:hidden">Prev</span>
              </Button>
              <Button
                variant="outline"
                onClick={nextCard}
                disabled={currentCardIndex === flashcards.length - 1}
                size="sm"
              >
                <span className="hidden sm:inline">Next</span>
                <span className="sm:hidden">Next</span>
                <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Mobile Tap Hint */}
          <div className="text-center mt-4 sm:hidden">
            <p className="text-xs text-gray-500 dark:text-gray-400">
              Tap card to flip
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}