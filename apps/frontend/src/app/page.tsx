'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Plus, BookOpen, Play } from 'lucide-react';
import { mockDecks } from '@/lib/mock-data';
import { Deck } from '@/lib/types';
import Link from 'next/link';

export default function Home() {
  const [decks] = useState<Deck[]>(mockDecks);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Learning App
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Create and study with custom learning decks
            </p>
          </div>
          <Button asChild>
            <Link href="/create">
              <Plus className="mr-2 h-4 w-4" />
              Create Deck
            </Link>
          </Button>
        </div>

        {/* Decks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deck) => (
            <Card key={deck.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{deck.title}</CardTitle>
                    <CardDescription className="mt-2">
                      {deck.description}
                    </CardDescription>
                  </div>
                  <div className={`w-4 h-4 rounded-full ${deck.color}`} />
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">{deck.topic}</Badge>
                  <span className="text-sm text-gray-500">
                    {deck.cards.length} cards
                  </span>
                </div>
                
                <div className="flex gap-2">
                  <Button variant="default" size="sm" asChild className="flex-1">
                    <Link href={`/game/flashcard/${deck.id}`}>
                      <BookOpen className="mr-2 h-4 w-4" />
                      Study
                    </Link>
                  </Button>
                  <Button variant="outline" size="sm" asChild className="flex-1">
                    <Link href={`/game/quiz/${deck.id}`}>
                      <Play className="mr-2 h-4 w-4" />
                      Quiz
                    </Link>
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Empty State */}
        {decks.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
              No decks yet
            </h3>
            <p className="mt-2 text-gray-500">
              Create your first learning deck to get started
            </p>
            <Button className="mt-4" asChild>
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Your First Deck
              </Link>
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
