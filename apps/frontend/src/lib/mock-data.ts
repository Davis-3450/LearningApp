import { Deck, Card } from './types';

const sampleCards: Card[] = [
  {
    id: '1',
    question: 'What is the capital of France?',
    answer: 'Paris',
    hint: 'City of Light',
    difficulty: 'easy',
    tags: ['geography', 'europe'],
    options: ['London', 'Berlin', 'Paris', 'Madrid'],
    correctAnswer: 'Paris'
  },
  {
    id: '2',
    question: 'What is 2 + 2?',
    answer: '4',
    difficulty: 'easy',
    tags: ['math', 'basic'],
    options: ['3', '4', '5', '6'],
    correctAnswer: '4'
  },
  {
    id: '3',
    question: 'Who wrote Romeo and Juliet?',
    answer: 'William Shakespeare',
    difficulty: 'medium',
    tags: ['literature', 'classics'],
    options: ['Charles Dickens', 'William Shakespeare', 'Jane Austen', 'Mark Twain'],
    correctAnswer: 'William Shakespeare'
  }
];

export const mockDecks: Deck[] = [
  {
    id: '1',
    title: 'Basic Geography',
    description: 'Learn world capitals and countries',
    topic: 'Geography',
    cards: sampleCards,
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Math Fundamentals',
    description: 'Basic arithmetic and algebra',
    topic: 'Mathematics',
    cards: [
      {
        id: '4',
        question: 'What is 5 × 7?',
        answer: '35',
        difficulty: 'easy',
        tags: ['math', 'multiplication'],
        options: ['30', '32', '35', '40'],
        correctAnswer: '35'
      }
    ],
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    color: 'bg-green-500'
  }
];

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 