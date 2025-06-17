'use client';

import { useState, useEffect, useMemo } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, RotateCcw, CheckCircle, XCircle, Loader } from 'lucide-react';
import { DecksAPI } from '@/lib/api/decks';
import type { Deck } from '@/shared/schemas/deck';
import { cn } from '@/lib/utils';

interface QuizAnswer {
  conceptIndex: number;
  selectedOption: string;
  isCorrect: boolean;
}

interface QuizQuestion {
  question: string;
  correctAnswer: string;
  options: string[];
  conceptIndex: number;
}

// Helper to shuffle array
const shuffleArray = <T,>(array: T[]): T[] => {
  return [...array].sort(() => Math.random() - 0.5);
};

// Generate quiz questions from deck concepts
const generateQuizQuestions = (deck: Deck): QuizQuestion[] => {
  const questions: QuizQuestion[] = [];
  
  deck.concepts.forEach((concept, index) => {
    if (concept.conceptType === 'term') {
      // Main question: What is the definition of [term]?
      const wrongAnswers = deck.concepts
        .filter((_, i) => i !== index)
        .map(c => c.conceptType === 'term' ? c.definition : '')
        .filter(def => def.length > 0)
        .slice(0, 3);
      
      if (wrongAnswers.length >= 2) {
        questions.push({
          question: `What is the definition of "${concept.term}"?`,
          correctAnswer: concept.definition,
          options: shuffleArray([concept.definition, ...wrongAnswers]),
          conceptIndex: index
        });
      }
      
      // Variation questions if available
      concept.variations?.forEach(variation => {
        if (variation.type === 'example' || variation.type === 'alternative-definition') {
          const wrongAnswers = deck.concepts
            .filter((_, i) => i !== index)
            .map(c => c.conceptType === 'term' ? c.term : '')
            .filter(term => term.length > 0)
            .slice(0, 3);
            
          if (wrongAnswers.length >= 2) {
            questions.push({
              question: variation.text,
              correctAnswer: concept.term,
              options: shuffleArray([concept.term, ...wrongAnswers]),
              conceptIndex: index
            });
          }
        }
      });
    }
  });
  
  return shuffleArray(questions).slice(0, Math.min(10, questions.length));
};

export default function QuizGame() {
  const params = useParams();
  const router = useRouter();
  const deckId = params.deckId as string;
  
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [questions, setQuestions] = useState<QuizQuestion[]>([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [showResult, setShowResult] = useState(false);
  const [answers, setAnswers] = useState<QuizAnswer[]>([]);
  const [isQuizComplete, setIsQuizComplete] = useState(false);

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const response = await DecksAPI.getOne(deckId);
        if (response.success && response.data) {
          const { deck } = response.data;
          setDeck(deck);
          const quizQuestions = generateQuizQuestions(deck);
          setQuestions(quizQuestions);
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

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="h-4 w-4 animate-spin" />
          Loading quiz...
        </div>
      </div>
    );
  }

  if (!deck || questions.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center p-4">
        <div className="text-center max-w-md">
          <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {!deck ? 'Deck not found' : 'No quiz questions available'}
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-4">
            {!deck ? 'The requested deck could not be loaded.' : 'This deck needs more concepts to generate quiz questions.'}
          </p>
          <Button onClick={() => router.push('/decks')}>
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Decks
          </Button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / questions.length) * 100;
  const score = answers.filter(a => a.isCorrect).length;

  const handleOptionSelect = (option: string) => {
    if (showResult || !currentQuestion) return;
    
    setSelectedOption(option);
    const isCorrect = option === currentQuestion.correctAnswer;
    const newAnswer: QuizAnswer = {
      conceptIndex: currentQuestion.conceptIndex,
      selectedOption: option,
      isCorrect
    };
    
    setAnswers(prev => [...prev, newAnswer]);
    setShowResult(true);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setShowResult(false);
    } else {
      setIsQuizComplete(true);
    }
  };

  const resetQuiz = () => {
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setShowResult(false);
    setAnswers([]);
    setIsQuizComplete(false);
    const quizQuestions = generateQuizQuestions(deck);
    setQuestions(quizQuestions);
  };

  const getOptionClass = (option: string) => {
    if (!showResult) {
      return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750';
    }

    const isCorrectAnswer = option === currentQuestion.correctAnswer;
    const isSelected = option === selectedOption;

    if (isCorrectAnswer) {
      return 'bg-green-100 border-green-500 text-green-800 dark:bg-green-900/20 dark:border-green-500 dark:text-green-200';
    }
    if (isSelected && !isCorrectAnswer) {
      return 'bg-red-100 border-red-500 text-red-800 dark:bg-red-900/20 dark:border-red-500 dark:text-red-200';
    }
    return 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 opacity-50';
  };

  if (isQuizComplete) {
    const percentage = Math.round((score / questions.length) * 100);
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <div className="container mx-auto px-4 py-4 sm:py-8">
          <div className="max-w-2xl mx-auto text-center">
            <Card className="p-4 sm:p-8">
              <CardHeader>
                <CardTitle className="text-xl sm:text-2xl">Quiz Complete! 🎉</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="mb-6">
                  <div className="text-3xl sm:text-4xl font-bold text-blue-600 dark:text-blue-400">
                    {percentage}%
                  </div>
                  <p className="text-gray-600 dark:text-gray-400 mt-2">
                    You scored {score} out of {questions.length} questions correctly
                  </p>
                </div>

                <div className="space-y-3 sm:space-y-4 mb-6 max-h-60 overflow-y-auto">
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

                <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center">
                  <Button onClick={resetQuiz} className="w-full sm:w-auto">Try Again</Button>
                  <Button variant="outline" onClick={() => router.push('/decks')} className="w-full sm:w-auto">
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
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 pb-20 sm:pb-32">
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-4 sm:mb-6">
          <div className="flex items-center gap-2 sm:gap-4 min-w-0 flex-1">
            <Button variant="ghost" onClick={() => router.push('/decks')} size="sm">
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="min-w-0 flex-1">
              <h1 className="text-lg sm:text-2xl font-bold text-gray-900 dark:text-white truncate">
                {deck.title}
              </h1>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Quiz Mode
              </p>
            </div>
          </div>
          <Button variant="outline" onClick={resetQuiz} size="sm" className="ml-2">
            <RotateCcw className="mr-2 h-4 w-4" />
            <span className="hidden sm:inline">Reset</span>
          </Button>
        </div>

        {/* Progress */}
        <div className="mb-4 sm:mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600 dark:text-gray-400">
              Question {currentQuestionIndex + 1} of {questions.length}
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
              <CardTitle className="text-lg sm:text-xl break-words">{currentQuestion?.question}</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {currentQuestion?.options.map((option, index) => (
                  <button
                    key={index}
                    onClick={() => handleOptionSelect(option)}
                    disabled={showResult}
                    className={cn(
                        'w-full p-3 sm:p-4 text-left rounded-lg border transition-colors flex items-center justify-between',
                        'disabled:cursor-not-allowed text-sm sm:text-base',
                        getOptionClass(option)
                    )}
                  >
                    <span className="break-words flex-1">{option}</span>
                    {showResult && option === currentQuestion.correctAnswer && (
                      <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 ml-2" />
                    )}
                    {showResult && selectedOption === option && option !== currentQuestion.correctAnswer && (
                      <XCircle className="h-5 w-5 text-red-500 flex-shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      {showResult && (
        <div className="fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-900 border-t border-gray-200 dark:border-gray-800 p-4">
          <div className="container mx-auto max-w-2xl flex items-center justify-between">
            <div className="flex items-center gap-3 min-w-0 flex-1">
              {answers[answers.length - 1]?.isCorrect ? (
                <CheckCircle className="h-6 w-6 text-green-500 flex-shrink-0" />
              ) : (
                <XCircle className="h-6 w-6 text-red-500 flex-shrink-0" />
              )}
              <div className="min-w-0 flex-1">
                <p className="font-medium">
                  {answers[answers.length - 1]?.isCorrect ? 'Correct!' : 'Incorrect'}
                </p>
                {!answers[answers.length - 1]?.isCorrect && (
                  <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                    Correct answer: {currentQuestion.correctAnswer}
                  </p>
                )}
              </div>
            </div>
            <Button onClick={handleNextQuestion} className="ml-4 flex-shrink-0">
              {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}