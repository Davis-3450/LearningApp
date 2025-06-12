'use client';

import { useState, useEffect } from 'react';
import { DecksAPI } from '@/lib/api/decks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Edit, Download, Play, FileText, Loader } from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';

interface Props {
  fileName: string;
  onBack: () => void;
}

export default function DeckDetailsView({ fileName, onBack }: Props) {
  const [loading, setLoading] = useState(true);
  const [deck, setDeck] = useState<Deck | null>(null);

  useEffect(() => {
    const loadDeck = async () => {
      try {
        const response = await DecksAPI.getOne(fileName);
        if (response.success && response.data) {
          setDeck(response.data.deck);
        } else {
          alert(`Failed to load deck: ${response.error}`);
          onBack();
        }
      } catch (error) {
        alert('Failed to load deck: Network error');
        onBack();
      } finally {
        setLoading(false);
      }
    };
    loadDeck();
  }, [fileName, onBack]);

  const handleExport = async () => {
    if (deck) {
      try {
        await DecksAPI.export(fileName, deck);
      } catch (error) {
        alert('Export failed');
      }
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader className="h-4 w-4 animate-spin" />
          Loading deck...
        </div>
      </div>
    );
  }

  if (!deck) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <p className="text-gray-500">Deck not found</p>
          <Button className="mt-4" onClick={onBack}>Back to Decks</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <Button variant="ghost" onClick={onBack}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <div className="flex-1">
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white">{deck.title}</h1>
              <p className="text-gray-600 dark:text-gray-400">{deck.description || 'No description provided'}</p>
              <div className="flex items-center gap-2 mt-2">
                <Badge variant="secondary">{deck.concepts.length} concept{deck.concepts.length !== 1 ? 's' : ''}</Badge>
                <Badge variant="outline" className="text-xs">{fileName}.json</Badge>
              </div>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <Button asChild>
              <a href={`/game/flashcard/${fileName}`}>
                <Play className="mr-2 h-4 w-4" />
                Play Flashcards
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`/game/quiz/${fileName}`}>
                <Play className="mr-2 h-4 w-4" />
                Play Quiz
              </a>
            </Button>
            <Button variant="outline" asChild>
              <a href={`/decks/edit/${fileName}`}>
                <Edit className="mr-2 h-4 w-4" />
                Edit
              </a>
            </Button>
            <Button variant="outline" onClick={handleExport}>
              <Download className="mr-2 h-4 w-4" />
              Export
            </Button>
          </div>
        </div>
        <div className="max-w-4xl mx-auto space-y-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">Concepts</h2>
          <div className="grid gap-6">
            {deck.concepts.map((concept, index) => (
              <Card key={index} className="hover:shadow-md transition-shadow">
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-xl text-blue-600 dark:text-blue-400">{concept.term}</CardTitle>
                      <CardDescription className="mt-2 text-base">{concept.definition}</CardDescription>
                    </div>
                    <Badge variant="outline" className="ml-4">#{index + 1}</Badge>
                  </div>
                </CardHeader>
                {concept.variations && concept.variations.length > 0 && (
                  <CardContent>
                    <div className="space-y-3">
                      <h4 className="font-medium text-gray-900 dark:text-white">Additional Information:</h4>
                      <div className="grid gap-3">
                        {concept.variations.map((variation, variationIndex) => (
                          <div key={variationIndex} className="flex items-start gap-3">
                            <Badge variant="secondary" className="capitalize text-xs">
                              {variation.type.replace('-', ' ')}
                            </Badge>
                            <p className="text-sm text-gray-600 dark:text-gray-400 flex-1">{variation.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </CardContent>
                )}
              </Card>
            ))}
          </div>
          {deck.concepts.length === 0 && (
            <Card>
              <CardContent className="text-center py-12">
                <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-gray-500 dark:text-gray-400">This deck has no concepts yet.</p>
                <Button asChild className="mt-4">
                  <a href={`/decks/edit/${fileName}`}>
                    <Edit className="mr-2 h-4 w-4" />
                    Add Concepts
                  </a>
                </Button>
              </CardContent>
            </Card>
          )}
          <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
            <CardContent className="pt-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{deck.concepts.length}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Concepts</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{deck.concepts.reduce((total, concept) => total + (concept.variations?.length || 0), 0)}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Total Variations</div>
                </div>
                <div>
                  <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">{deck.concepts.length * 2 + deck.concepts.reduce((total, concept) => total + (concept.variations?.length || 0), 0)}</div>
                  <div className="text-sm text-blue-600 dark:text-blue-400">Potential Questions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

