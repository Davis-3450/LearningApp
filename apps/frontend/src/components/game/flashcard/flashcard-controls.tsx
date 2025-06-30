import React from 'react';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface FlashcardControlsProps {
  onPrevious: () => void;
  onNext: () => void;
  canGoPrevious: boolean;
  canGoNext: boolean;
}

export const FlashcardControls: React.FC<FlashcardControlsProps> = ({
  onPrevious,
  onNext,
  canGoPrevious,
  canGoNext,
}) => {
  return (
    <div className="flex items-center justify-center mt-4 sm:mt-6">
      <div className="flex items-center justify-between w-full max-w-xs">
        <Button
          variant="outline"
          onClick={onPrevious}
          disabled={!canGoPrevious}
          size="sm"
          aria-label="Previous card"
        >
          <ChevronLeft className="mr-1 sm:mr-2 h-4 w-4" />
          <span className="hidden sm:inline">Previous</span>
          <span className="sm:hidden">Prev</span>
        </Button>
        <Button
          variant="outline"
          onClick={onNext}
          disabled={!canGoNext}
          size="sm"
          aria-label="Next card"
        >
          <span className="hidden sm:inline">Next</span>
          <span className="sm:hidden">Next</span>
          <ChevronRight className="ml-1 sm:ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};