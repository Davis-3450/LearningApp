'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RotateCcw } from 'lucide-react';
import { mockDecks } from '@/lib/mock-data';
import { Deck, Card as CardType, RichContent } from '@/lib/types';
import { cn } from '@/lib/utils';
import Confetti from 'react-confetti';
import { useWindowSize } from '@uidotdev/usehooks';

interface MatchItem {
  id: string; // "cardId-prompt" or "cardId-answer"
  cardId: string;
  content: RichContent;
  isMatched: boolean;
  type: 'prompt' | 'answer';
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
  const [matchItems, setMatchItems] = useState<MatchItem[]>([]);
  const [selectedItems, setSelectedItems] = useState<MatchItem[]>([]);
  const [isComplete, setIsComplete] = useState(false);

  useEffect(() => {
    const foundDeck = mockDecks.find(d => d.id === deckId);
    if (foundDeck) {
      setDeck(foundDeck);
      resetGame(foundDeck.cards);
    }
  }, [deckId]);

  const resetGame = (cards: CardType[]) => {
    const items: MatchItem[] = [];
    cards.forEach(card => {
      items.push({ id: `${card.id}-prompt`, cardId: card.id, content: card.prompt, isMatched: false, type: 'prompt' });
      items.push({ id: `${card.id}-answer`, cardId: card.id, content: card.answer, isMatched: false, type: 'answer' });
    });
    setMatchItems(shuffleArray(items));
    setSelectedItems([]);
    setIsComplete(false);
  };
  
  useEffect(() => {
    if (selectedItems.length === 2) {
      const [first, second] = selectedItems;
      if (first.cardId === second.cardId && first.type !== second.type) {
        // Correct match
        setMatchItems(prev =>
          prev.map(item =>
            item.cardId === first.cardId ? { ...item, isMatched: true } : item
          )
        );
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

  if (!deck) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Deck not found</h2>
          <Button onClick={() => router.push('/')} className="mt-4">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {isComplete && <Confetti width={width || 0} height={height || 0} />}
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-4">
            <Button variant="ghost" onClick={() => router.push('/')}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                {deck.title} - Matching Game
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                Match the prompts with their correct answers.
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={() => resetGame(deck.cards)}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Game Grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {matchItems.map(item => (
            <button
              key={item.id}
              onClick={() => handleItemClick(item)}
              disabled={item.isMatched || selectedItems.length >= 2}
              className={cn(
                "h-32 md:h-40 p-4 rounded-lg border-2 text-center flex items-center justify-center transition-all duration-300",
                "focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
                {
                  "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700": !item.isMatched,
                  "border-primary ring-2 ring-primary": selectedItems.find(i => i.id === item.id),
                  "bg-green-100 dark:bg-green-900/30 border-green-500 text-green-800 dark:text-green-200 opacity-50 cursor-not-allowed": item.isMatched,
                  "border-red-500 ring-2 ring-red-500": selectedItems.length === 2 && selectedItems.find(i => i.id === item.id) && !item.isMatched,
                }
              )}
            >
              <p className="text-sm md:text-base font-medium">
                {item.content.text}
              </p>
            </button>
          ))}
        </div>
        
        {isComplete && (
           <div className="max-w-md mx-auto mt-8 text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
             <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
               🎉 Well Done!
             </h3>
             <p className="text-green-600 dark:text-green-300 mt-2">
               You&apos;ve matched all the pairs correctly.
             </p>
             <div className="flex gap-2 justify-center mt-4">
               <Button onClick={() => resetGame(deck.cards)}>Play Again</Button>
               <Button variant="outline" onClick={() => router.push('/')}>
                 Back to Decks
               </Button>
             </div>
           </div>
        )}
      </div>
    </div>
  );
}