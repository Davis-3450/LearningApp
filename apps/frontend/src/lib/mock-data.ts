import { Deck, Card } from './types';

const allCards: Card[] = [
  // Geography Card
  {
    id: '1',
    difficulty: 'easy',
    tags: ['geography', 'capitals'],
    prompt: { text: 'What is the capital of France?' },
    answer: { text: 'Paris' },
    variations: {
      quiz: {
        distractors: [{ text: 'London' }, { text: 'Berlin' }, { text: 'Madrid' }],
      },
      cloze: { sentence: 'The capital of France is {blank}.' }
    },
    explanation: { text: 'Paris, France\'s capital, is a major European city and a global center for art, fashion, gastronomy and culture.' }
  },
  // Math Card 1
  {
    id: '2',
    difficulty: 'easy',
    tags: ['math', 'arithmetic'],
    prompt: { text: 'What is 2 + 2?' },
    answer: { text: '4' },
    variations: {
      quiz: {
        distractors: [{ text: '3' }, { text: '5' }, { text: '6' }],
      }
    },
  },
  // Literature Card
  {
    id: '3',
    difficulty: 'medium',
    tags: ['literature', 'classics'],
    prompt: { text: 'Who wrote Romeo and Juliet?' },
    answer: { text: 'William Shakespeare' },
    variations: {
      quiz: {
        distractors: [{ text: 'Charles Dickens' }, { text: 'Jane Austen' }, { text: 'Mark Twain' }],
      },
    },
  },
  // Math Card 2
  {
    id: '4',
    difficulty: 'easy',
    tags: ['math', 'arithmetic'],
    prompt: { text: 'What is 5 × 7?' },
    answer: { text: '35' },
    variations: {
      quiz: {
        distractors: [{ text: '30' }, { text: '32' }, { text: '40' }],
      },
    },
  },
];

export const mockDecks: Deck[] = [
  {
    id: '1',
    title: 'Basic Geography',
    description: 'Learn world capitals and countries',
    topic: 'Geography',
    cards: allCards.filter(c => c.tags?.includes('geography')),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    color: 'bg-blue-500'
  },
  {
    id: '2',
    title: 'Math Fundamentals',
    description: 'Basic arithmetic questions',
    topic: 'Mathematics',
    cards: allCards.filter(c => c.tags?.includes('math')),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-20'),
    color: 'bg-green-500'
  },
  {
    id: '3',
    title: 'Classic Literature',
    description: 'Questions about famous authors and their works.',
    topic: 'Literature',
    cards: allCards.filter(c => c.tags?.includes('literature')),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-22'),
    color: 'bg-purple-500'
  }
];

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 