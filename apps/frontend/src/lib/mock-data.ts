import { Deck, Card, Topic } from './types';

// Define topic categories
export const topics: Topic[] = [
  {
    id: 'geography',
    name: 'Geography',
    description: 'Learn about countries, capitals, and landmarks',
    icon: '🌍',
    color: 'bg-blue-500'
  },
  {
    id: 'mathematics',
    name: 'Mathematics',
    description: 'Master numbers, equations, and problem solving',
    icon: '🔢',
    color: 'bg-green-500'
  },
  {
    id: 'literature',
    name: 'Literature',
    description: 'Explore classic works and famous authors',
    icon: '📚',
    color: 'bg-purple-500'
  },
  {
    id: 'science',
    name: 'Science',
    description: 'Discover physics, chemistry, and biology',
    icon: '🔬',
    color: 'bg-orange-500'
  },
  {
    id: 'history',
    name: 'History',
    description: 'Journey through important historical events',
    icon: '🏛️',
    color: 'bg-red-500'
  },
  {
    id: 'languages',
    name: 'Languages',
    description: 'Learn vocabulary and grammar in different languages',
    icon: '🗣️',
    color: 'bg-indigo-500'
  }
];

// Expanded card collection
const allCards: Card[] = [
  // Geography Cards - Easy
  {
    id: '1',
    difficulty: 'easy',
    tags: ['geography', 'capitals', 'europe'],
    prompt: { text: 'What is the capital of France?' },
    answer: { text: 'Paris' },
    variations: {
      quiz: {
        distractors: [{ text: 'London' }, { text: 'Berlin' }, { text: 'Madrid' }],
      },
      cloze: { sentence: 'The capital of France is {blank}.' }
    },
    explanation: { text: 'Paris is France\'s capital and largest city, known for the Eiffel Tower and Louvre Museum.' }
  },
  {
    id: '2',
    difficulty: 'easy',
    tags: ['geography', 'capitals', 'europe'],
    prompt: { text: 'What is the capital of Italy?' },
    answer: { text: 'Rome' },
    variations: {
      quiz: {
        distractors: [{ text: 'Milan' }, { text: 'Naples' }, { text: 'Florence' }],
      }
    },
    explanation: { text: 'Rome is the capital of Italy and home to the Vatican City.' }
  },
  
  // Geography Cards - Medium
  {
    id: '3',
    difficulty: 'medium',
    tags: ['geography', 'capitals', 'asia'],
    prompt: { text: 'What is the capital of Bangladesh?' },
    answer: { text: 'Dhaka' },
    variations: {
      quiz: {
        distractors: [{ text: 'Chittagong' }, { text: 'Sylhet' }, { text: 'Rajshahi' }],
      }
    }
  },

  // Math Cards - Easy
  {
    id: '4',
    difficulty: 'easy',
    tags: ['math', 'arithmetic', 'addition'],
    prompt: { text: 'What is 2 + 2?' },
    answer: { text: '4' },
    variations: {
      quiz: {
        distractors: [{ text: '3' }, { text: '5' }, { text: '6' }],
      }
    },
  },
  {
    id: '5',
    difficulty: 'easy',
    tags: ['math', 'arithmetic', 'multiplication'],
    prompt: { text: 'What is 5 × 3?' },
    answer: { text: '15' },
    variations: {
      quiz: {
        distractors: [{ text: '12' }, { text: '18' }, { text: '20' }],
      }
    },
  },

  // Math Cards - Medium
  {
    id: '6',
    difficulty: 'medium',
    tags: ['math', 'algebra'],
    prompt: { text: 'What is the value of x in: 2x + 6 = 14?' },
    answer: { text: '4' },
    variations: {
      quiz: {
        distractors: [{ text: '3' }, { text: '5' }, { text: '6' }],
      }
    },
    explanation: { text: 'Subtract 6 from both sides: 2x = 8, then divide by 2: x = 4' }
  },

  // Literature Cards
  {
    id: '7',
    difficulty: 'medium',
    tags: ['literature', 'classics', 'shakespeare'],
    prompt: { text: 'Who wrote Romeo and Juliet?' },
    answer: { text: 'William Shakespeare' },
    variations: {
      quiz: {
        distractors: [{ text: 'Charles Dickens' }, { text: 'Jane Austen' }, { text: 'Mark Twain' }],
      },
    },
  },
  {
    id: '8',
    difficulty: 'easy',
    tags: ['literature', 'classics'],
    prompt: { text: 'Who wrote "Pride and Prejudice"?' },
    answer: { text: 'Jane Austen' },
    variations: {
      quiz: {
        distractors: [{ text: 'Charlotte Brontë' }, { text: 'Emily Dickinson' }, { text: 'Virginia Woolf' }],
      },
    },
  },

  // Science Cards
  {
    id: '9',
    difficulty: 'easy',
    tags: ['science', 'physics', 'basic'],
    prompt: { text: 'What is the chemical symbol for water?' },
    answer: { text: 'H2O' },
    variations: {
      quiz: {
        distractors: [{ text: 'CO2' }, { text: 'O2' }, { text: 'H2SO4' }],
      }
    },
    explanation: { text: 'Water consists of two hydrogen atoms and one oxygen atom.' }
  },
  {
    id: '10',
    difficulty: 'medium',
    tags: ['science', 'biology'],
    prompt: { text: 'What is the powerhouse of the cell?' },
    answer: { text: 'Mitochondria' },
    variations: {
      quiz: {
        distractors: [{ text: 'Nucleus' }, { text: 'Ribosome' }, { text: 'Chloroplast' }],
      }
    },
    explanation: { text: 'Mitochondria produce energy (ATP) for cellular processes.' }
  },

  // History Cards
  {
    id: '11',
    difficulty: 'easy',
    tags: ['history', 'world-war'],
    prompt: { text: 'In which year did World War II end?' },
    answer: { text: '1945' },
    variations: {
      quiz: {
        distractors: [{ text: '1944' }, { text: '1946' }, { text: '1943' }],
      }
    }
  },
  {
    id: '12',
    difficulty: 'medium',
    tags: ['history', 'ancient'],
    prompt: { text: 'Who was the first emperor of Rome?' },
    answer: { text: 'Augustus' },
    variations: {
      quiz: {
        distractors: [{ text: 'Julius Caesar' }, { text: 'Nero' }, { text: 'Trajan' }],
      }
    }
  },

  // Language Cards
  {
    id: '13',
    difficulty: 'easy',
    tags: ['languages', 'spanish', 'vocabulary'],
    prompt: { text: 'How do you say "hello" in Spanish?' },
    answer: { text: 'Hola' },
    variations: {
      quiz: {
        distractors: [{ text: 'Bonjour' }, { text: 'Ciao' }, { text: 'Guten Tag' }],
      }
    }
  },
  {
    id: '14',
    difficulty: 'medium',
    tags: ['languages', 'french', 'vocabulary'],
    prompt: { text: 'What does "bibliothèque" mean in French?' },
    answer: { text: 'Library' },
    variations: {
      quiz: {
        distractors: [{ text: 'Bookstore' }, { text: 'School' }, { text: 'Museum' }],
      }
    }
  }
];

export const mockDecks: Deck[] = [
  // Geography Decks
  {
    id: '1',
    title: 'European Capitals - Beginner',
    description: 'Learn the capitals of major European countries',
    topic: 'Geography',
    topicId: 'geography',
    difficulty: 'beginner',
    cards: allCards.filter(c => c.tags?.includes('geography') && c.tags?.includes('europe') && c.difficulty === 'easy'),
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15'),
    color: 'bg-blue-500',
    estimatedTime: 10
  },
  {
    id: '2',
    title: 'World Capitals - Intermediate',
    description: 'Test your knowledge of capitals from around the world',
    topic: 'Geography',
    topicId: 'geography',
    difficulty: 'intermediate',
    cards: allCards.filter(c => c.tags?.includes('geography') && c.difficulty === 'medium'),
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-20'),
    color: 'bg-blue-600',
    estimatedTime: 15
  },

  // Math Decks
  {
    id: '3',
    title: 'Basic Arithmetic',
    description: 'Master addition, subtraction, and multiplication',
    topic: 'Mathematics',
    topicId: 'mathematics',
    difficulty: 'beginner',
    cards: allCards.filter(c => c.tags?.includes('math') && c.difficulty === 'easy'),
    createdAt: new Date('2024-01-10'),
    updatedAt: new Date('2024-01-25'),
    color: 'bg-green-500',
    estimatedTime: 8
  },
  {
    id: '4',
    title: 'Algebra Fundamentals',
    description: 'Learn to solve basic algebraic equations',
    topic: 'Mathematics',
    topicId: 'mathematics',
    difficulty: 'intermediate',
    cards: allCards.filter(c => c.tags?.includes('algebra')),
    createdAt: new Date('2024-01-12'),
    updatedAt: new Date('2024-01-27'),
    color: 'bg-green-600',
    estimatedTime: 20
  },

  // Literature Decks
  {
    id: '5',
    title: 'Classic Authors',
    description: 'Learn about famous writers and their works',
    topic: 'Literature',
    topicId: 'literature',
    difficulty: 'beginner',
    cards: allCards.filter(c => c.tags?.includes('literature') && c.difficulty === 'easy'),
    createdAt: new Date('2024-01-15'),
    updatedAt: new Date('2024-01-30'),
    color: 'bg-purple-500',
    estimatedTime: 12
  },
  {
    id: '6',
    title: 'Shakespeare & Classics',
    description: 'Deep dive into classic literature',
    topic: 'Literature',
    topicId: 'literature',
    difficulty: 'intermediate',
    cards: allCards.filter(c => c.tags?.includes('literature') && c.difficulty === 'medium'),
    createdAt: new Date('2024-01-18'),
    updatedAt: new Date('2024-02-02'),
    color: 'bg-purple-600',
    estimatedTime: 18
  },

  // Science Decks
  {
    id: '7',
    title: 'Basic Science Facts',
    description: 'Essential science knowledge for beginners',
    topic: 'Science',
    topicId: 'science',
    difficulty: 'beginner',
    cards: allCards.filter(c => c.tags?.includes('science') && c.difficulty === 'easy'),
    createdAt: new Date('2024-01-20'),
    updatedAt: new Date('2024-02-05'),
    color: 'bg-orange-500',
    estimatedTime: 10
  },
  {
    id: '8',
    title: 'Biology Basics',
    description: 'Learn fundamental concepts in biology',
    topic: 'Science',
    topicId: 'science',
    difficulty: 'intermediate',
    cards: allCards.filter(c => c.tags?.includes('biology')),
    createdAt: new Date('2024-01-22'),
    updatedAt: new Date('2024-02-07'),
    color: 'bg-orange-600',
    estimatedTime: 15
  },

  // History Decks
  {
    id: '9',
    title: 'World History Basics',
    description: 'Important dates and events in world history',
    topic: 'History',
    topicId: 'history',
    difficulty: 'beginner',
    cards: allCards.filter(c => c.tags?.includes('history') && c.difficulty === 'easy'),
    createdAt: new Date('2024-01-25'),
    updatedAt: new Date('2024-02-10'),
    color: 'bg-red-500',
    estimatedTime: 12
  },
  {
    id: '10',
    title: 'Ancient Civilizations',
    description: 'Explore the great civilizations of the past',
    topic: 'History',
    topicId: 'history',
    difficulty: 'intermediate',
    cards: allCards.filter(c => c.tags?.includes('ancient')),
    createdAt: new Date('2024-01-28'),
    updatedAt: new Date('2024-02-12'),
    color: 'bg-red-600',
    estimatedTime: 20
  },

  // Language Decks
  {
    id: '11',
    title: 'Spanish Basics',
    description: 'Essential Spanish vocabulary for beginners',
    topic: 'Languages',
    topicId: 'languages',
    difficulty: 'beginner',
    cards: allCards.filter(c => c.tags?.includes('spanish')),
    createdAt: new Date('2024-02-01'),
    updatedAt: new Date('2024-02-15'),
    color: 'bg-indigo-500',
    estimatedTime: 15
  },
  {
    id: '12',
    title: 'French Vocabulary',
    description: 'Intermediate French words and phrases',
    topic: 'Languages',
    topicId: 'languages',
    difficulty: 'intermediate',
    cards: allCards.filter(c => c.tags?.includes('french')),
    createdAt: new Date('2024-02-03'),
    updatedAt: new Date('2024-02-17'),
    color: 'bg-indigo-600',
    estimatedTime: 18
  }
];

// Add computed properties
mockDecks.forEach(deck => {
  deck.cardCount = deck.cards.length;
});

export const generateId = (): string => {
  return Math.random().toString(36).substr(2, 9);
}; 