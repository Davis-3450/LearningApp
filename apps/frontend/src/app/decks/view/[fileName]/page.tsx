'use client';

import { useRouter, useParams } from 'next/navigation';
import { useDeck } from '@/lib/hooks/use-decks';
import { DecksAPI } from '@/lib/api/decks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download, Play, FileText } from 'lucide-react';
import Link from 'next/link';
import { CardLoading, ErrorState, EmptyState } from '@/components/ui/loading-states';
import { toast } from 'sonner';

export default function ViewDeckPage() {
  const router = useRouter();
  const params = useParams();
  const fileName = Array.isArray(params.fileName) ? params.fileName[0] : params.fileName;

  // React Query hook for data fetching
  const { data: deckData, isLoading, error, refetch } = useDeck(fileName || '');
  const deck = deckData?.deck;

  // Redirect if no fileName
  if (!fileName) {
    router.push('/decks');
    return null;
  }

  const handleExport = async () => {
    if (deck && fileName) {
      try {
        await DecksAPI.export(fileName, deck);
        toast.success('Deck exported successfully!');
      } catch (error) {
        console.error(error);
        toast.error('Export failed');
      }
    }
  };

  // Loading state
  if (isLoading) {
    return <CardLoading message="Loading deck..." />;
  }

  // Error state
  if (error) {
    return (
      <ErrorState
        title="Failed to load deck"
        message={error instanceof Error ? error.message : 'An unknown error occurred'}
        onRetry={() => refetch()}
        showBackButton={true}
        backHref="/decks"
        backLabel="Back to Decks"
      />
    );
  }

  // Not found state
  if (!deck) {
    return (
      <ErrorState
        title="Deck not found"
        message="The requested deck could not be found"
        showBackButton={true}
        backHref="/decks"
        backLabel="Back to Decks"
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" asChild>
              <Link href="/decks">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-foreground">
                {deck.title}
              </h1>
              <p className="text-muted-foreground">
                {deck.description || 'No description provided'}
              </p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">
                  {deck.concepts.length} concept{deck.concepts.length !== 1 ? 's' : ''}
                </Badge>
                <Badge variant="outline" className="text-xs">
                  {fileName}.json
                </Badge>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <Link href={`/game/flashcard/${fileName}`}>
                <Play className="mr-2 h-4 w-4" />
                Play Flashcards
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/game/quiz/${fileName}`}>
                <Play className="mr-2 h-4 w-4" />
                Play Quiz
              </Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href={`/decks/edit/${fileName}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>

        {/* Concepts */}
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-foreground">
            Concepts
          </h2>
          
          {deck.concepts.length > 0 ? (
            <div className="grid gap-6">
              {deck.concepts.map((concept, index) => (
                <Card key={index} className="hover:shadow-md transition-shadow">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <CardTitle className="text-xl text-blue-600 dark:text-blue-400">
                          {concept.term}
                        </CardTitle>
                        <CardDescription className="mt-2 text-base">
                          {concept.definition}
                        </CardDescription>
                      </div>
                      <Badge variant="outline" className="ml-4">
                        #{index + 1}
                      </Badge>
                    </div>
                  </CardHeader>

                  {concept.variations && concept.variations.length > 0 && (
                    <CardContent>
                      <div className="space-y-3">
                        <h4 className="font-medium text-foreground">
                          Additional Information:
                        </h4>
                        <div className="grid gap-3">
                          {concept.variations.map((variation, variationIndex) => (
                            <div key={variationIndex} className="flex items-start gap-3">
                              <Badge 
                                variant="secondary" 
                                className="capitalize text-xs"
                              >
                                {variation.type.replace('-', ' ')}
                              </Badge>
                              <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">
                                {variation.text}
                              </p>
                            </div>
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  )}
                </Card>
              ))}
            </div>
          ) : (
            <EmptyState
              icon={FileText}
              title="No concepts yet"
              description="This deck has no concepts yet."
              action={
                <Button asChild>
                  <Link href={`/decks/edit/${fileName}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Add Concepts
                  </Link>
                </Button>
              }
            />
          )}

          {/* Summary */}
          {deck.concepts.length > 0 && (
            <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
              <CardContent className="pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {deck.concepts.length}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Total Concepts
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {deck.concepts.reduce((total, concept) => 
                        total + (concept.variations?.length || 0), 0
                      )}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Total Variations
                    </div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">
                      {deck.concepts.length * 2 + deck.concepts.reduce((total, concept) => 
                        total + (concept.variations?.length || 0), 0
                      )}
                    </div>
                    <div className="text-sm text-blue-600 dark:text-blue-400">
                      Potential Questions
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
} 