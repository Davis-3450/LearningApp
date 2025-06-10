'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, ChevronLeft, ChevronRight, Eye, EyeOff } from 'lucide-react';
import { mockDecks } from '@/lib/mock-data';
import { Deck, Card as CardType } from '@/lib/types';

export default function FlashcardGame() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);
  const [completedCards, setCompletedCards] = useState<Set<number>>(new Set());
  const [needsReview, setNeedsReview] = useState<Set<number>>(new Set());

  useEffect(() => {
    const foundDeck = mockDecks.find(d => d.id === deckId);
    if (foundDeck) {
      setDeck(foundDeck);
    }
  }, [deckId]);

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

  const currentCard = deck.cards[currentCardIndex];
  const progress = ((currentCardIndex + 1) / deck.cards.length) * 100;

  const handleSelfAssessment = (knewIt: boolean) => {
    if (knewIt) {
      setCompletedCards(prev => new Set([...prev, currentCardIndex]));
    } else {
      setNeedsReview(prev => new Set([...prev, currentCardIndex]));
    }
    nextCard();
  };

  const nextCard = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setShowAnswer(false);
    } else {
      // Logic for finishing the deck
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
    setCompletedCards(new Set());
    setNeedsReview(new Set());
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
              Card {currentCardIndex + 1} of {deck.cards.length}
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
                  {showAnswer ? currentCard.answer.text : currentCard.prompt.text}
                </p>
              </div>

              {currentCard.explanation && showAnswer && (
                <div className="mt-4 p-3 bg-gray-100 dark:bg-gray-800 rounded-lg">
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    💡 {currentCard.explanation.text}
                  </p>
                </div>
              )}

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
            {!showAnswer ? (
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
                  disabled={currentCardIndex === deck.cards.length - 1}
                >
                  Next
                  <ChevronRight className="ml-2 h-4 w-4" />
                </Button>
              </div>
            ) : (
              <div className="flex gap-4">
                <Button
                  variant="destructive"
                  className="bg-red-500 hover:bg-red-600"
                  onClick={() => handleSelfAssessment(false)}
                >
                  Review Again
                </Button>
                <Button
                  variant="default"
                  className="bg-green-500 hover:bg-green-600"
                  onClick={() => handleSelfAssessment(true)}
                >
                  Got It!
                </Button>
              </div>
            )}
          </div>

          {/* Tags */}
          {currentCard.tags && currentCard.tags.length > 0 && (
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {currentCard.tags.map((tag, index) => (
                <Badge key={index} variant="outline">
                  {tag}
                </Badge>
              ))}
            </div>
          )}
        </div>

        {/* Completion Message */}
        {currentCardIndex === deck.cards.length - 1 && completedCards.has(currentCardIndex) && (
          <div className="max-w-md mx-auto mt-8 text-center p-6 bg-green-50 dark:bg-green-900/20 rounded-lg">
            <h3 className="text-lg font-semibold text-green-800 dark:text-green-200">
              🎉 Deck Complete!
            </h3>
            <p className="text-green-600 dark:text-green-300 mt-2">
              You've studied all {deck.cards.length} cards in this deck.
            </p>
            <div className="flex gap-2 justify-center mt-4">
              <Button onClick={resetSession}>Study Again</Button>
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