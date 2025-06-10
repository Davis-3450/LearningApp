'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle } from 'lucide-react';
import { mockDecks } from '@/lib/mock-data';
import { Deck, Card as CardType } from '@/lib/types';
import { FeedbackBanner } from '@/components/ui/feedback-banner';
import { cn } from '@/lib/utils';

interface QuizAnswer {
  cardIndex: number;
  selectedOption: string;
  isCorrect: boolean;
}

export default function QuizGame() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [currentCardIndex, setCurrentCardIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

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
  const score = answers.filter(a => a.isCorrect).length;

  const handleOptionSelect = (option: string) => {
    if (showResult) return;
    
    setSelectedOption(option);
    const isCorrect = option === currentCard.correctAnswer;
    const newAnswer: QuizAnswer = {
      cardIndex: currentCardIndex,
      selectedOption: option,
      isCorrect
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentCardIndex < deck.cards.length - 1) {
      setCurrentCardIndex(currentCardIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentCardIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setAnswers([]);
    setIsQuizComplete(false);
  };

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750';
    }

    const isCorrectAnswer = option === currentCard.correctAnswer;
    const isSelected = option === selectedOption;

    if (isCorrectAnswer) {
      return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-200';
    }
    if (isSelected && !isCorrectAnswer) {
      return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-200';
    }
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50';
  }

  if (isQuizComplete) {
    const percentage = Math.round((score / deck.cards.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-8">
              <CardHeader>
                <CardTitle className="text-2xl">Quiz Complete! 🎉</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {percentage}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    You scored {score} out of {deck.cards.length} questions correctly
                  </p>
                </div>

                <div className="space-y-4 mb-6">
                  {answers.map((answer, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <span className="text-sm">Question {index + 1}</span>
                      <div className="flex items-center gap-2">
                        {answer.isCorrect ? (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        ) : (
                          <XCircle className="h-5 w-5 text-red-500" />
                        )}
                        <span className="text-sm font-medium">
                          {answer.isCorrect ? 'Correct' : 'Incorrect'}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 justify-center">
                  <Button onClick={resetQuiz}>Try Again</Button>
                  <Button variant="outline" onClick={() => router.push('/')}>
                    Back to Decks
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-32">
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
                Quiz Mode
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={resetQuiz}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentCardIndex + 1} of {deck.cards.length}
            </span>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Score: {score}/{answers.length}
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Quiz Question */}
        <div className="max-w-2xl mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">{currentCard.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentCard.options?.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showResult}
                    className={cn(
                        'w-full p-4 text-left rounded-lg border transition-colors flex items-center justify-between',
                        'disabled:cursor-not-allowed',
                        getOptionClass(option)
                    )}
                  >
                    <span>{option}</span>
                    {showResult && option === currentCard.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500" />
                    )}
                    {showResult && selectedOption === option && option !== currentCard.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showResult && (
        <FeedbackBanner
          isCorrect={answers[answers.length - 1].isCorrect}
          correctAnswer={currentCard.correctAnswer}
          onContinue={handleNextQuestion}
          continueText={currentCardIndex < deck.cards.length - 1 ? 'Next Question' : 'Finish Quiz'}
        />
      )}
    </div>
  );
} 