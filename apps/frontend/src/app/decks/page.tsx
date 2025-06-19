'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { DecksAPI } from '@/lib/api/decks';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NavigationMenu, NavigationItem } from '@/components/ui/navigation-menu';
import { 
  Plus, 
  Upload, 
  Download, 
  Edit, 
  Trash2, 
  RefreshCw,
  FileText,
  Bot,
  FolderOpen,
  Settings,
  Archive,
  BookOpen,
  Play,
  Shapes
} from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';

interface DeckWithFileName {
  fileName: string;
  deck: Deck;
}

export default function DecksPage() {
  const router = useRouter()
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
      console.error(error);
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
      console.error(error);
      alert('Delete failed: Network error');
    }
  };

  // Handle deck export
  const handleExport = async (fileName: string, deck: Deck) => {
    try {
      await DecksAPI.export(fileName, deck);
    } catch (error) {
      console.error(error);
      alert('Export failed');
    }
  };

  // Deck Card Component
  const DeckCard = ({ fileName, deck }: DeckWithFileName) => (
    <Card className="hover:shadow-lg transition-all hover:scale-[1.02]">
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg mb-2">{deck.title}</CardTitle>
            <CardDescription className="mb-3">
              {deck.description}
            </CardDescription>
            <div className="flex items-center gap-2 mb-2">
              <Badge variant="outline" className="text-xs">
                <BookOpen className="mr-1 h-3 w-3" />
                {deck.concepts.length} concepts
              </Badge>
              <Badge variant="secondary" className="text-xs">
                {deck.concepts.length * 2} cards
              </Badge>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Button variant="default" size="sm" asChild className="flex-1">
            <Link href={`/game/flashcard/${fileName}`}>
              <BookOpen className="mr-1 h-3 w-3" />
              Study
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/game/quiz/${fileName}`}>
              <Play className="mr-1 h-3 w-3" />
              Quiz
            </Link>
          </Button>
        </div>
        
        <div className="flex gap-2 mb-3">
          <Button variant="secondary" size="sm" asChild className="flex-1">
            <Link href={`/game/matching/${fileName}`}>
              <Shapes className="mr-1 h-3 w-3" />
              Matching
            </Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/decks/view/${fileName}`}>
              <FileText className="mr-1 h-3 w-3" />
              View
            </Link>
          </Button>
        </div>

        <div className="flex gap-2 pt-2 border-t">
          <Button variant="ghost" size="sm" asChild className="flex-1">
            <Link href={`/decks/edit/${fileName}`}>
              <Edit className="mr-1 h-3 w-3" />
              Edit
            </Link>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleExport(fileName, deck)}
            className="flex-1"
          >
            <Download className="mr-1 h-3 w-3" />
            Export
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => handleDelete(fileName, deck.title)}
            className="text-destructive hover:text-destructive flex-1"
          >
            <Trash2 className="mr-1 h-3 w-3" />
            Delete
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <RefreshCw className="h-4 w-4 animate-spin" />
          Loading decks...
        </div>
      </div>
    );
  }

  // Browse Decks Content
  const BrowseContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-6xl space-y-6">
      {/* Action Bar */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold">Your Decks</h2>
          <p className="text-muted-foreground">
            {decks.length} deck{decks.length !== 1 ? 's' : ''} available
          </p>
        </div>
        <Button onClick={loadDecks} variant="outline" size="sm">
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </div>

      {/* Decks Grid */}
      {decks.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center py-12">
            <FolderOpen className="h-12 w-12 text-muted-foreground mb-4" />
            <h3 className="text-lg font-semibold mb-2">No decks found</h3>
            <p className="text-muted-foreground text-center mb-4">
              Get started by creating your first deck or importing an existing one.
            </p>
            <div className="flex gap-2">
              <Button asChild>
                <Link href="/decks/create">
                  <Plus className="mr-2 h-4 w-4" />
                  Create Deck
                </Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/decks/ai-generate">
                  <Bot className="mr-2 h-4 w-4" />
                  Generate with AI
                </Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {decks.map((deckItem) => (
            <DeckCard key={deckItem.fileName} {...deckItem} />
          ))}
        </div>
      )}
    </div>
  );

  // Create Content
  const CreateContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Plus className="h-5 w-5" />
              Create New Deck
            </CardTitle>
            <CardDescription>
              Build a custom learning deck from scratch with your own content
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/decks/create">
                <Plus className="mr-2 h-4 w-4" />
                Start Creating
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="hover:shadow-lg transition-all hover:scale-[1.02]">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bot className="h-5 w-5" />
              AI-Generated Deck
            </CardTitle>
            <CardDescription>
              Let AI create a deck for you based on any topic or subject
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full" variant="secondary">
              <Link href="/decks/ai-generate">
                <Bot className="mr-2 h-4 w-4" />
                Generate with AI
              </Link>
            </Button>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Quick Tips</CardTitle>
          <CardDescription>
            Best practices for creating effective learning decks
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">📝 Content Guidelines</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Keep concepts concise and focused on one idea</li>
              <li>Use clear, simple language that's easy to understand</li>
              <li>Include examples when explaining complex concepts</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">🎯 Effective Learning</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Aim for 10-20 concepts per deck for optimal retention</li>
              <li>Review regularly using spaced repetition</li>
              <li>Mix different game types to reinforce learning</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Import/Export Content
  const ImportExportContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Upload className="h-5 w-5" />
              Import Deck
            </CardTitle>
            <CardDescription>
              Upload a JSON file to import an existing deck
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="relative">
              <Button variant="outline" disabled={importing} className="w-full">
                <Upload className="mr-2 h-4 w-4" />
                {importing ? 'Importing...' : 'Choose JSON File'}
              </Button>
              <Input
                type="file"
                accept=".json"
                onChange={handleImport}
                className="absolute inset-0 opacity-0 cursor-pointer"
                disabled={importing}
              />
            </div>
            <p className="text-sm text-muted-foreground">
              Supported format: JSON files exported from this app
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Archive className="h-5 w-5" />
              Bulk Operations
            </CardTitle>
            <CardDescription>
              Manage multiple decks at once
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Button variant="outline" className="w-full" disabled>
              <Download className="mr-2 h-4 w-4" />
              Export All Decks
            </Button>
            <p className="text-sm text-muted-foreground">
              Coming soon: Bulk export and backup features
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Import Guidelines</CardTitle>
          <CardDescription>
            How to properly format and import deck files
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <h4 className="font-medium">📄 File Format</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Files must be in JSON format with .json extension</li>
              <li>Content should follow the app's deck schema</li>
              <li>Maximum file size: 10MB</li>
            </ul>
          </div>
          <div className="space-y-2">
            <h4 className="font-medium">⚠️ Important Notes</h4>
            <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
              <li>Imported decks will be validated before saving</li>
              <li>Invalid or corrupted files will be rejected</li>
              <li>Deck names must be unique (duplicates will be renamed)</li>
            </ul>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  // Management Content
  const ManagementContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            Deck Statistics
          </CardTitle>
          <CardDescription>
            Overview of your learning collection
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">{decks.length}</div>
              <div className="text-sm text-muted-foreground">Total Decks</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {decks.reduce((acc, { deck }) => acc + deck.concepts.length, 0)}
              </div>
              <div className="text-sm text-muted-foreground">Total Concepts</div>
            </div>
            <div className="text-center p-4 border rounded-lg">
              <div className="text-2xl font-bold text-primary">
                {decks.reduce((acc, { deck }) => acc + deck.concepts.length, 0) * 2}
              </div>
              <div className="text-sm text-muted-foreground">Total Flashcards</div>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>
            Common deck management tasks
          </CardDescription>
        </CardHeader>
        <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <Button variant="outline" onClick={loadDecks} className="justify-start">
            <RefreshCw className="mr-2 h-4 w-4" />
            Refresh All Decks
          </Button>
          <Button variant="outline" asChild className="justify-start">
            <Link href="/settings">
              <Settings className="mr-2 h-4 w-4" />
              App Settings
            </Link>
          </Button>
          <Button variant="outline" disabled className="justify-start">
            <Archive className="mr-2 h-4 w-4" />
            Backup Data
          </Button>
          <Button variant="outline" disabled className="justify-start">
            <Download className="mr-2 h-4 w-4" />
            Export Statistics
          </Button>
        </CardContent>
      </Card>
    </div>
  );

  const navigationItems: NavigationItem[] = [
    {
      id: 'browse',
      label: 'Browse',
      shortLabel: 'Browse',
      icon: FolderOpen,
      content: <BrowseContent />
    },
    {
      id: 'create',
      label: 'Create',
      shortLabel: 'Create',
      icon: Plus,
      content: <CreateContent />
    },
    {
      id: 'import',
      label: 'Import/Export',
      shortLabel: 'Import',
      icon: Archive,
      content: <ImportExportContent />
    },
    {
      id: 'manage',
      label: 'Manage',
      shortLabel: 'Manage',
      icon: Settings,
      content: <ManagementContent />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu
        items={navigationItems}
        defaultValue="browse"
        title="Deck Manager"
        description="Create, edit, and manage your learning decks"
        showBackButton={true}
        onBack={() => router.back()}
        className="container mx-auto px-4 py-6 max-w-7xl"
      />
    </div>
  );
} 
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {/* Mobile-only top bar with hamburger */}
      <div className="md:hidden bg-white dark:bg-gray-950 border-b border-gray-200 dark:border-gray-800 px-4 py-3 flex items-center justify-between sticky top-0 z-30">
        <Button variant="ghost" size="icon" onClick={() => setSidebarOpen(true)}>
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
          <span className="sr-only">Open menu</span>
        </Button>

        <span className="font-semibold">Deck Manager</span>
        <div />

        {/* Sidebar overlay */}
        {sidebarOpen && (
          <div className="fixed inset-0 z-40 flex">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setSidebarOpen(false)}
            />

            {/* Side menu */}
            <aside className="relative w-72 max-w-full h-full bg-white dark:bg-gray-900 shadow-lg p-6 space-y-4">
              <h2 className="text-lg font-semibold mb-4">Menu</h2>
              <nav className="space-y-2">
                <Link href="/" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>Home</Link>
                <Link href="/decks" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>Decks</Link>
                <Link href="/decks/create" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>Create Deck</Link>
                <Link href="/decks/ai-generate" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>Generate with AI</Link>
                <Link href="/settings" className="block px-3 py-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800" onClick={() => setSidebarOpen(false)}>Settings</Link>
              </nav>
            </aside>
          </div>
        )}
      </div>

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