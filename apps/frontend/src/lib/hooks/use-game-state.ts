import { useState, useCallback, useMemo } from 'react';

export interface GameState<T = any> {
  currentIndex: number;
  score: number;
  isComplete: boolean;
  data: T[];
  progress: number;
  currentItem: T | null;
}

export interface GameActions {
  nextItem: () => void;
  previousItem: () => void;
  reset: () => void;
  updateScore: (score: number | ((prev: number) => number)) => void;
  goToIndex: (index: number) => void;
}

export type GameHook<T> = GameState<T> & GameActions;

export const useGameState = <T>(initialData: T[]): GameHook<T> => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [isComplete, setIsComplete] = useState(false);

  const currentItem = useMemo(() => {
    return initialData[currentIndex] || null;
  }, [initialData, currentIndex]);

  const progress = useMemo(() => {
    if (initialData.length === 0) return 0;
    return ((currentIndex + 1) / initialData.length) * 100;
  }, [currentIndex, initialData.length]);

  const nextItem = useCallback(() => {
    if (currentIndex < initialData.length - 1) {
      setCurrentIndex(prev => prev + 1);
    } else {
      setIsComplete(true);
    }
  }, [currentIndex, initialData.length]);

  const previousItem = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex(prev => prev - 1);
    }
  }, [currentIndex]);

  const goToIndex = useCallback((index: number) => {
    if (index >= 0 && index < initialData.length) {
      setCurrentIndex(index);
      setIsComplete(false);
    }
  }, [initialData.length]);

  const reset = useCallback(() => {
    setCurrentIndex(0);
    setScore(0);
    setIsComplete(false);
  }, []);

  const updateScore = useCallback((newScore: number | ((prev: number) => number)) => {
    setScore(newScore);
  }, []);

  return {
    // State
    currentIndex,
    score,
    isComplete,
    data: initialData,
    progress,
    currentItem,
    // Actions
    nextItem,
    previousItem,
    reset,
    updateScore,
    goToIndex,
  };
};