'use client';

import { cn } from "@/lib/utils";
import { Button } from "./button";
import { CheckCircle, XCircle } from "lucide-react";

interface FeedbackBannerProps {
  isCorrect: boolean;
  correctAnswer?: string;
  onContinue: () => void;
  continueText?: string;
}

export const FeedbackBanner = ({ isCorrect, correctAnswer, onContinue, continueText = "Continue" }: FeedbackBannerProps) => {
  const title = isCorrect ? "Excellent!" : "Study this one!";
  const Icon = isCorrect ? CheckCircle : XCircle;

  return (
    <div
      className={cn(
        "fixed bottom-0 left-0 right-0 w-full p-4 md:p-6 border-t-2 z-50",
        isCorrect
          ? "bg-green-100 border-green-500 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-200"
          : "bg-red-100 border-red-500 text-red-800 dark:bg-red-900/30 dark:border-red-600 dark:text-red-200"
      )}
    >
      <div className="container mx-auto flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Icon className="h-8 w-8 flex-shrink-0" />
          <div>
            <h3 className="font-bold text-lg">{title}</h3>
            {!isCorrect && correctAnswer && (
              <p className="text-sm">
                <span className="font-semibold">Correct answer:</span> {correctAnswer}
              </p>
            )}
          </div>
        </div>
        <Button
          onClick={onContinue}
          variant={isCorrect ? 'default' : 'destructive'}
          className={cn(
            "text-white",
            isCorrect
              ? "bg-green-600 hover:bg-green-700"
              : "bg-red-600 hover:bg-red-700"
          )}
        >
          {continueText}
        </Button>
      </div>
    </div>
  );
}; 