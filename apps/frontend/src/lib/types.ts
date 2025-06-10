// A single piece of content, which can be text, an image, or audio.
export interface RichContent {
  text?: string;
  image?: string; // URL to image asset
  audio?: string; // URL to audio asset
}

// Defines the data for a card. A card represents a single concept to be learned.
export interface Card {
  id: string;
  tags?: string[];
  difficulty: 'easy' | 'medium' | 'hard';

  // Core concept information, usable for flashcards, matching, etc.
  prompt: RichContent;   // The main question or prompt, e.g., { text: "What is the capital of France?" }
  answer: RichContent;    // The main answer, e.g., { text: "Paris" }

  // Additional data to support different game modes
  variations: {
    // For quiz mode. The full list of options is the answer + distractors.
    quiz?: {
      distractors: RichContent[];
    };
    
    // For fill-in-the-blank / cloze deletion
    cloze?: {
      // Sentence with a placeholder, e.g., "The capital of France is {blank}."
      sentence: string; 
    };
  };

  // Optional rich explanation that can be shown after answering
  explanation?: RichContent; 
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