'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Navigation } from '@/components/layout/navigation';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, Trophy } from 'lucide-react';
import { DecksAPI } from '@/lib/api/decks';
import type { Deck } from '@/shared/schemas/deck';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks';

interface MatchItem {
  id: string; // "conceptIndex-term" or "conceptIndex-definition"
  conceptIndex: number;
  content: string;
  isMatched: boolean;
  type: 'term' | 'definition';
}

const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

export default function MatchingGame() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  const { width, height } = useWindowSize();

  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [matchItems, setMatchItems] = useState<MatchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MatchItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);
  const [score, setScore] = useState(0);
  const [attempts, setAttempts] = useState(0);

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const response = await DecksAPI.getOne(deckId);
        if (response.success && response.data) {
          const { deck } = response.data;
          setDeck(deck);
          resetGame(deck);
        } else {
          console.error('Failed to load deck:', response.error);
        }
      } catch (error) {
        console.error('Error loading deck:', error);
      } finally {
        setLoading(false);
      }
    };

    loadDeck();
  }, [deckId]);

  const resetGame = (deckData: Deck) => {
    const items: MatchItem[] = [];
    deckData.concepts.forEach((concept, index) => {
      if (concept.conceptType === 'term') {
        items.push({ 
          id: `${index}-term`, 
          conceptIndex: index, 
          content: concept.term, 
          isMatched: false, 
          type: 'term' 
        });
        items.push({ 
          id: `${index}-definition`, 
          conceptIndex: index, 
          content: concept.definition, 
          isMatched: false, 
          type: 'definition' 
        });
      }
    });
    setMatchItems(shuffleArray(items));
    setSelectedItems([]);
    setIsComplete(false);
    setScore(0);
    setAttempts(0);
  };
  
  useEffect(() => {
    if (selectedItems.length === 2) {
      const [first, second] = selectedItems;
      setAttempts(prev => prev + 1);
      
      if (first.conceptIndex === second.conceptIndex && first.type !== second.type) {
        // Correct match
        setMatchItems(prev =>
          prev.map(item =>
            item.conceptIndex === first.conceptIndex ? { ...item, isMatched: true } : item
          )
        );
        setScore(prev => prev + 1);
        setSelectedItems([]);
      } else {
        // Incorrect match
        setTimeout(() => {
          setSelectedItems([]);
        }, 1000);
      }
    }
  }, [selectedItems]);

  useEffect(() => {
    if (matchItems.length > 0 && matchItems.every(item => item.isMatched)) {
      setIsComplete(true);
    }
  }, [matchItems]);
  
  const handleItemClick = (item: MatchItem) => {
    if (item.isMatched || selectedItems.length >= 2 || selectedItems.find(i => i.id === item.id)) {
      return;
    }
    setSelectedItems(prev => [...prev, item]);
  };

  const progress = matchItems.length > 0 ? (score / (matchItems.length / 2)) * 100 : 0;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 dark:border-white"></div>
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="text-center py-12">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Deck not found</h2>
          <Button onClick={() => router.push('/decks')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Decks
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      {isComplete && <Confetti width={width || 0} height={height || 0} />}
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6 sm:mb-8">
          <div className="flex items-center gap-4 min-w-0 flex-1">
            <Button variant="ghost" onClick={() => router.push('/decks')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {deck.title} - Matching Game
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Match the terms with their correct definitions.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => resetGame(deck)} className="ml-2">
            <RotateCcw className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Progress: {score}/{matchItems.length / 2} pairs
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Attempts: {attempts}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-4">
          {matchItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={item.isMatched || selectedItems.length >= 2}
              className={cn(
                "h-24 sm:h-32 md:h-40 p-3 sm:p-4 rounded-lg border-2 text-center flex items-center justify-center transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 text-sm sm:text-base",
                {
                  "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700": !item.isMatched && !selectedItems.find(i => i.id === item.id),
                  "border-primary ring-2 ring-primary bg-blue-50 dark:bg-blue-900/20": selectedItems.find(i => i.id === item.id) && !item.isMatched,
                  "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200 cursor-not-allowed": item.isMatched,
                  "border-red-500 ring-2 ring-red-500 bg-red-50 dark:bg-red-900/20": selectedItems.length === 2 && selectedItems.find(i => i.id === item.id) && !item.isMatched,
                }
              )}
            >
              <p className="font-medium break-words">
                {item.content}
              </p>
            </button>
          ))}
        </div>
        
        {isComplete && (
           <div className="max-w-md mx-auto mt-8 text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
             <Trophy className="mx-auto h-12 w-12 text-green-600 dark:text-green-400 mb-4" />
             <h3 className="text-lg font-semibold text-green-800 dark:text-green-200 mb-2">
               Congratulations! 🎉
             </h3>
             <p className="text-green-600 dark:text-green-300 mb-4">
               You've matched all {score} pairs correctly in {attempts} attempts!
             </p>
             <div className="flex flex-col sm:flex-row gap-2 justify-center">
               <Button onClick={() => resetGame(deck)}>Play Again</Button>
               <Button variant="outline" onClick={() => router.push('/decks')}>
                 Back to Decks
               </Button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}