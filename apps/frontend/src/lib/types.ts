export interface Card {
  id: string;
  question: string;
  answer: string;
  hint?: string;
  difficulty: 'easy' | 'medium' | 'hard';
  tags?: string[];
  // For quiz mode
  options?: string[];
  correctAnswer?: string;
  // For matching
  pair?: string;
}

export interface Deck {
  id: string;
  title: string;
  description: string;
  topic: string;
  cards: Card[];
  createdAt: Date;
  updatedAt: Date;
  color: string;
}

export type GameType = 'flashcard' | 'quiz' | 'matching' | 'word-search' | 'word-scramble';

export interface GameSession {
  deckId: string;
  gameType: GameType;
  score: number;
  totalCards: number;
  completedCards: number;
  startTime: Date;
  endTime?: Date;
} 