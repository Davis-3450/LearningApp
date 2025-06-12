'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { DecksAPI } from '@/lib/api/decks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { 
  Plus, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw,
  FileText,
  Bot
} from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';

interface DeckWithFileName {
  fileName: string;
  deck: Deck;
}

export default function DecksPage() {
  const [decks, setDecks] = useState<DeckWithFileName[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);

  // Load all decks
  const loadDecks = async () => {
    setLoading(true);
    try {
      const response = await DecksAPI.getAll();
      if (response.success && response.data) {
        setDecks(response.data);
      }
    } catch (error) {
      console.error('Failed to load decks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDecks();
  }, []);

  // Handle file import
  const handleImport = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImporting(true);
    try {
      const response = await DecksAPI.import(file);
      if (response.success) {
        await loadDecks(); // Refresh the list
        alert('Deck imported successfully!');
      } else {
        alert(`Import failed: ${response.error}`);
      }
    } catch (error) {
      alert('Import failed: Network error');
    } finally {
      setImporting(false);
      // Reset file input
      event.target.value = '';
    }
  };

  // Handle deck deletion
  const handleDelete = async (fileName: string, deckTitle: string) => {
    if (!confirm(`Are you sure you want to delete "${deckTitle}"?`)) return;

    try {
      const response = await DecksAPI.delete(fileName);
      if (response.success) {
        await loadDecks(); // Refresh the list
        alert('Deck deleted successfully!');
      } else {
        alert(`Delete failed: ${response.error}`);
      }
    } catch (error) {
      alert('Delete failed: Network error');
    }
  };

  // Handle deck export
  const handleExport = async (fileName: string, deck: Deck) => {
    try {
      await DecksAPI.export(fileName, deck);
    } catch (error) {
      alert('Export failed');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading decks...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">

      {/* Main content */}
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Deck Manager
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Create, edit, and manage your learning decks. All changes are saved to JSON files.
          </p>
        </div>

        {/* Action Bar */}
        <div className="flex flex-wrap gap-4 mb-8">
          <Button asChild>
            <Link href="/decks/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Deck
            </Link>
          </Button>
          
          <div className="relative">
            <Button variant="outline" disabled={importing}>
              <Upload className="mr-2 h-4 w-4" />
              {importing ? 'Importing...' : 'Import JSON'}
            </Button>
            <Input
              type="file"
              accept=".json"
              onChange={handleImport}
              className="absolute inset-0 opacity-0 cursor-pointer"
              disabled={importing}
            />
          </div>

          <Button variant="outline" onClick={loadDecks}>
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button variant="outline" asChild>
            <Link href="/decks/ai-generate">
              <Bot className="mr-2 h-4 w-4" />
              Generate with AI
            </Link>
          </Button>
        </div>

        {/* Decks Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map(({ fileName, deck }) => (
            <Card key={deck.id} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <CardTitle className="text-xl">{deck.title}</CardTitle>
                <CardDescription>{deck.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">
                    {deck.concepts.length} concept{deck.concepts.length !== 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="outline" className="text-xs">
                    {fileName}.json
                  </Badge>
                </div>
                
                {/* Play Buttons */}
                <div className="grid grid-cols-2 gap-2 mb-3">
                  <Button asChild size="sm" className="w-full">
                    <Link href={`/game/flashcard/${fileName}`}>
                      Flashcards
                    </Link>
                  </Button>
                  <Button asChild variant="outline" size="sm" className="w-full">
                    <Link href={`/game/quiz/${fileName}`}>
                      Quiz
                    </Link>
                  </Button>
                </div>

                {/* Management Buttons */}
                <div className="grid grid-cols-4 gap-1">
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/decks/edit/${fileName}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleExport(fileName, deck)}
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button asChild variant="ghost" size="sm">
                    <Link href={`/decks/view/${fileName}`}>
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(fileName, deck.title)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {decks.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No decks found
            </p>
            <p className="text-gray-400 dark:text-gray-500 mb-6">
              Create your first deck or import existing JSON files to get started.
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/decks/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Deck
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
} 