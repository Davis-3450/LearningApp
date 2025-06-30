import React, { memo } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BookOpen, Play, Users, Shapes } from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';

interface DeckCardProps {
  deck: Deck;
  fileName: string;
}

export const DeckCard = memo<DeckCardProps>(({ deck, fileName }) => {
  return (
    <Card className="hover:shadow-lg transition-all hover:scale-[1.02] h-full">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            <CardTitle className="text-lg mb-2 line-clamp-2">{deck.title}</CardTitle>
            <CardDescription className="mb-3 line-clamp-3">
              {deck.description}
            </CardDescription>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                <Users className="mr-1 h-3 w-3" />
                {deck.concepts.length} concepts
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-0">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-gray-500 flex items-center gap-1">
            <BookOpen className="h-4 w-4" />
            {deck.concepts.length * 2} flashcards
          </span>
        </div>
        
        <div className="space-y-2">
          <div className="grid grid-cols-2 gap-2">
            <Button variant="default" size="sm" asChild className="w-full">
              <Link href={`/game/flashcard/${fileName}`}>
                <BookOpen className="mr-2 h-4 w-4" />
                Study
              </Link>
            </Button>
            <Button variant="outline" size="sm" asChild className="w-full">
              <Link href={`/game/quiz/${fileName}`}>
                <Play className="mr-2 h-4 w-4" />
                Quiz
              </Link>
            </Button>
          </div>
          <Button variant="secondary" size="sm" asChild className="w-full">
            <Link href={`/game/matching/${fileName}`}>
              <Shapes className="mr-2 h-4 w-4" />
              Matching Game
            </Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
});

DeckCard.displayName = 'DeckCard';