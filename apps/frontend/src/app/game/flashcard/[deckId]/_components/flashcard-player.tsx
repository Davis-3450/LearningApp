'use client';

import { useState } from 'react';
import { GameLayout } from '@/components/game/game-layout';
import { GameHeader } from '@/components/game/game-header';
import { GameProgress } from '@/components/game/game-progress';
import { FlashcardDisplay } from '@/components/game/flashcard/flashcard-display';
import { FlashcardControls } from '@/components/game/flashcard/flashcard-controls';
import { useGameState } from '@/lib/hooks/use-game-state';
import type { Deck } from '@/shared/schemas/deck';
import type { Flashcard } from '@/shared/schemas/cards';

interface FlashcardPlayerProps {
  deck: Deck;
  flashcards: Flashcard[];
}

export function FlashcardPlayer({ deck, flashcards }: FlashcardPlayerProps) {
  const [showAnswer, setShowAnswer] = useState(false);
  const gameState = useGameState(flashcards);

  const handleFlip = () => {
    setShowAnswer(!showAnswer);
  };

  const handleNext = () => {
    gameState.nextItem();
    setShowAnswer(false);
  };

  const handlePrevious = () => {
    gameState.previousItem();
    setShowAnswer(false);
  };

  const handleReset = () => {
    gameState.reset();
    setShowAnswer(false);
  };

  if (!gameState.currentItem) {
    return (
      <GameLayout>
        <div className="text-center py-12">
          <p className="text-gray-500">No flashcards available</p>
        </div>
      </GameLayout>
    );
  }

  return (
    <GameLayout>
      <GameHeader 
        deck={deck} 
        onReset={handleReset} 
        gameType="Flashcard Study Mode"
      />
      
      <GameProgress 
        current={gameState.currentIndex + 1}
        total={flashcards.length}
        label="Card"
      />

      <FlashcardDisplay
        card={gameState.currentItem}
        showAnswer={showAnswer}
        onFlip={handleFlip}
      />

      <FlashcardControls
        onPrevious={handlePrevious}
        onNext={handleNext}
        canGoPrevious={gameState.currentIndex > 0}
        canGoNext={gameState.currentIndex < flashcards.length - 1}
      />
    </GameLayout>
  );
}