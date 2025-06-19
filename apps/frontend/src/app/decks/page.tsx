'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Navigation } from '@/components/layout/navigation';
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
  Bot,
  Search
} from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';

interface DeckWithFileName {
  fileName: string;
  deck: Deck;
}

export default function DecksPage() {
  const [decks, setDecks] = useState<DeckWithFileName[]>([]);
  const [filteredDecks, setFilteredDecks] = useState<DeckWithFileName[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Load all decks
  const loadDecks = async () => {
    setLoading(true);
    try {
      const response = await DecksAPI.getAll();
      if (response.success && response.data) {
        setDecks(response.data);
        setFilteredDecks(response.data);
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

  // Filter decks based on search query
  useEffect(() => {
    if (!searchQuery.trim()) {
      setFilteredDecks(decks);
    } else {
      const filtered = decks.filter(({ deck }) =>
        deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
      );
      setFilteredDecks(filtered);
    }
  }, [searchQuery, decks]);

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
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Navigation />
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center gap-2">
            <RefreshCw className="h-4 w-4 animate-spin" />
            Loading decks...
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Deck Manager
          </h1>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400">
            Create, edit, and manage your learning decks. All changes are saved to JSON files.
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              type="text"
              placeholder="Search decks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {/* Action Bar */}
        <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 mb-6 sm:mb-8">
          <Button asChild className="w-full sm:w-auto">
            <Link href="/decks/create">
              <Plus className="mr-2 h-4 w-4" />
              Create New Deck
            </Link>
          </Button>
          
          <div className="relative w-full sm:w-auto">
            <Button variant="outline" disabled={importing} className="w-full sm:w-auto">
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

          <Button variant="outline" onClick={loadDecks} className="w-full sm:w-auto">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh
          </Button>

          <Button variant="outline" asChild className="w-full sm:w-auto">
            <Link href="/decks/ai-generate">
              <Bot className="mr-2 h-4 w-4" />
              Generate with AI
            </Link>
          </Button>
        </div>

        {/* Decks Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
          {filteredDecks.map(({ fileName, deck }) => (
            <Card key={deck.id} className="hover:shadow-lg transition-shadow h-full flex flex-col">
              <CardHeader className="flex-1">
                <CardTitle className="text-lg sm:text-xl line-clamp-2">{deck.title}</CardTitle>
                <CardDescription className="line-clamp-3">{deck.description}</CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex items-center justify-between mb-4">
                  <Badge variant="secondary">
                    {deck.concepts.length} concept{deck.concepts.length !== 1 ? 's' : ''}
                  </Badge>
                  <Badge variant="outline" className="text-xs truncate max-w-24">
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
                  <Button asChild variant="ghost" size="sm" title="Edit">
                    <Link href={`/decks/edit/${fileName}`}>
                      <Edit className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleExport(fileName, deck)}
                    title="Export"
                  >
                    <Download className="h-4 w-4" />
                  </Button>
                  <Button asChild variant="ghost" size="sm" title="View">
                    <Link href={`/decks/view/${fileName}`}>
                      <FileText className="h-4 w-4" />
                    </Link>
                  </Button>
                  <Button 
                    variant="ghost" 
                    size="sm"
                    onClick={() => handleDelete(fileName, deck.title)}
                    className="text-red-600 hover:text-red-700"
                    title="Delete"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* No Results State */}
        {!loading && filteredDecks.length === 0 && searchQuery && (
          <div className="text-center py-12">
            <Search className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No decks found for "{searchQuery}"
            </p>
            <Button variant="outline" onClick={() => setSearchQuery('')}>
              Clear Search
            </Button>
          </div>
        )}

        {/* Empty State */}
        {!loading && decks.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400 mb-4" />
            <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">
              No decks found
            </p>
            <p className="text-gray-400 dark:text-gray-500 mb-6 px-4">
              Create your first deck or import existing JSON files to get started.
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-3 sm:gap-4">
              <Button asChild className="w-full sm:w-auto">
                <Link href="/decks/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Deck
                </Link>
              </Button>
              <Button asChild variant="outline" className="w-full sm:w-auto">
                <Link href="/decks/ai-generate">
                  <Bot className="mr-2 h-4 w-4" />
                  Generate with AI
                </Link>
              </Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}