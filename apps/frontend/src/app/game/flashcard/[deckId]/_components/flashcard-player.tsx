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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {deck.title}
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Flashcard Study Mode
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={resetSession}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
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
          <Card className="min-h-[400px] cursor-pointer" onClick={() => setShowAnswer(!showAnswer)}>
            <CardContent className="p-8 flex flex-col justify-center items-center text-center h-full min-h-[400px]">
              <div className="mb-4">
                <Badge variant={showAnswer ? "default" : "secondary"}>
                  {showAnswer ? "Answer" : "Question"}
                </Badge>
              </div>
              
              <div className="flex-1 flex items-center justify-center">
                <p className="text-xl md:text-2xl font-medium text-gray-900 dark:text-white">
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
                  {showAnswer ? "Hide" : "Show"} Answer
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Controls */}
          <div className="flex items-center justify-center mt-6">
            <div className="flex items-center justify-between w-full max-w-xs">
              <Button
                variant="outline"
                onClick={prevCard}
                disabled={currentCardIndex === 0}
              >
                <ChevronLeft className="mr-2 h-4 w-4" />
                Previous
              </Button>
              <Button
                variant="outline"
                onClick={nextCard}
                disabled={currentCardIndex === flashcards.length - 1}
              >
                Next
                <ChevronRight className="ml-2 h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 