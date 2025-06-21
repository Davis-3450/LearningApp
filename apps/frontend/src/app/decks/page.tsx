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
  Shapes,
  Search,
  Share2
} from 'lucide-react';
import type { Deck } from '@/shared/schemas/deck';
import { 
  PageContent, 
  PageSection, 
  ContentGrid, 
  LoadingGrid,
  SearchHeader
} from '@/components/ui/page-layout';
import { 
  DeckCard as StandardDeckCard, 
  EmptyStateCard,
  FilterTabs,
  ActionCard,
  QuickStartCard
} from '@/components/ui/common-cards';
import { PostDeckDialog } from '@/components/ui/post-deck-dialog';

interface DeckWithFileName {
  fileName: string;
  deck: Deck;
}

export default function DecksPage() {
  const router = useRouter();
  const [decks, setDecks] = useState<DeckWithFileName[]>([]);
  const [loading, setLoading] = useState(true);
  const [importing, setImporting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [postDialog, setPostDialog] = useState<{ isOpen: boolean; fileName?: string; deck?: Deck }>({ 
    isOpen: false 
  });

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

  // Filter decks based on search and filter
  const filteredDecks = decks.filter(({ deck }) => {
    const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (filterType === 'all') return matchesSearch;
    return matchesSearch && deck.difficulty === filterType;
  });

  // Enhanced Deck Card Component with actions
  const DeckCardWithActions = ({ fileName, deck }: DeckWithFileName) => (
    <Card className="hover:shadow-lg transition-all border-0 shadow-sm">
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-primary/10 flex items-center justify-center">
            <BookOpen className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm leading-tight mb-1 truncate">{deck.title}</h3>
            <p className="text-xs text-muted-foreground mb-2 line-clamp-2">{deck.description}</p>
            <div className="flex items-center gap-2 mb-3">
              <Badge variant="outline" className="text-xs h-5">
                {deck.concepts.length} concepts
              </Badge>
              <Badge variant="secondary" className="text-xs h-5">
                {deck.concepts.length * 2} cards
              </Badge>
              {deck.difficulty && (
                <Badge variant="outline" className="text-xs h-5">
                  {deck.difficulty}
                </Badge>
              )}
            </div>
            
            {/* Study Actions */}
            <div className="grid grid-cols-2 gap-2 mb-3">
              <Button size="sm" className="h-7 text-xs" asChild>
                <Link href={`/game/flashcard/${fileName}`}>
                  <BookOpen className="mr-1 h-3 w-3" />
                  Study
                </Link>
              </Button>
              <Button variant="outline" size="sm" className="h-7 text-xs" asChild>
                <Link href={`/game/quiz/${fileName}`}>
                  <Play className="mr-1 h-3 w-3" />
                  Quiz
                </Link>
              </Button>
            </div>

            {/* Management Actions */}
            <div className="grid grid-cols-4 gap-1">
              <Button variant="ghost" size="sm" className="h-6 text-xs px-2" asChild>
                <Link href={`/decks/edit/${fileName}`}>
                  <Edit className="h-3 w-3" />
                </Link>
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-6 text-xs px-2"
                onClick={() => handleExport(fileName, deck)}
              >
                <Download className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2"
                onClick={() => setPostDialog({ isOpen: true, fileName, deck })}
              >
                <Share2 className="h-3 w-3" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="h-6 text-xs px-2 text-destructive hover:text-destructive"
                onClick={() => handleDelete(fileName, deck.title)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          </div>
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

  // Browse Content - Main deck library
  const BrowseContent = () => {
    const filterOptions = [
      { value: 'all', label: 'All Decks' },
      { value: 'beginner', label: 'Beginner' },
      { value: 'intermediate', label: 'Intermediate' },
      { value: 'advanced', label: 'Advanced' }
    ];

    return (
      <div className="pb-20">
        <SearchHeader
          searchValue={searchQuery}
          onSearchChange={setSearchQuery}
          placeholder="Search your decks..."
        >
          <FilterTabs
            options={filterOptions}
            selected={filterType}
            onSelect={setFilterType}
          />
        </SearchHeader>

        <PageContent>
          {loading ? (
            <LoadingGrid count={6} />
          ) : filteredDecks.length > 0 ? (
            <ContentGrid>
              {filteredDecks.map(({ fileName, deck }) => (
                <DeckCardWithActions key={deck.id} fileName={fileName} deck={deck} />
              ))}
            </ContentGrid>
          ) : (
            <EmptyStateCard
              icon={BookOpen}
              title={searchQuery ? "No decks found" : "No decks yet"}
              description={searchQuery ? "Try adjusting your search" : "Create your first deck to get started"}
              action={
                !searchQuery ? (
                  <Button asChild>
                    <Link href="/decks/create">
                      <Plus className="mr-2 h-4 w-4" />
                      Create Deck
                    </Link>
                  </Button>
                ) : undefined
              }
            />
          )}
        </PageContent>
      </div>
    );
  };

  // Create Content - Quick actions for creating decks
  const CreateContent = () => {
    const createActions = [
      {
        href: '/decks/create',
        icon: Plus,
        title: 'Create New Deck',
        subtitle: 'Build a custom deck from scratch',
        variant: 'default' as const
      },
      {
        href: '/decks/ai-generate',
        icon: Bot,
        title: 'AI Generate',
        subtitle: 'Let AI create a deck for you',
        variant: 'outline' as const
      }
    ];

    return (
      <div className="pb-20">
        <PageContent>
          <QuickStartCard title="Create New Deck" actions={createActions} />
          
          <PageSection title="Recent Templates" subtitle="Based on your activity">
            <ContentGrid>
              <Card className="border-dashed">
                <CardContent className="flex flex-col items-center justify-center py-8">
                  <FileText className="h-8 w-8 text-muted-foreground mb-2" />
                  <p className="text-sm text-muted-foreground">No templates yet</p>
                </CardContent>
              </Card>
            </ContentGrid>
          </PageSection>
        </PageContent>
      </div>
    );
  };

  // Import/Export Content
  const ImportExportContent = () => (
    <div className="pb-20">
      <PageContent>
        <PageSection title="Import Deck" subtitle="Add decks from files">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <Upload className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                <h3 className="text-lg font-semibold mb-2">Import from File</h3>
                <p className="text-sm text-muted-foreground mb-4">
                  Upload a JSON file to import a deck
                </p>
                <div>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImport}
                    className="hidden"
                    id="deck-import"
                    disabled={importing}
                  />
                  <Button asChild disabled={importing}>
                    <label htmlFor="deck-import" className="cursor-pointer">
                      {importing ? (
                        <>
                          <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                          Importing...
                        </>
                      ) : (
                        <>
                          <Upload className="mr-2 h-4 w-4" />
                          Choose File
                        </>
                      )}
                    </label>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </PageSection>

        <PageSection title="Export Options" subtitle="Save and share your decks">
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Export All Decks</h4>
                    <p className="text-sm text-muted-foreground">Download all your decks as a ZIP file</p>
                  </div>
                  <Button variant="outline" size="sm">
                    <Download className="mr-2 h-4 w-4" />
                    Export All
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>
      </PageContent>
    </div>
  );

  // Management Content
  const ManagementContent = () => (
    <div className="pb-20">
      <PageContent>
        <PageSection title="Deck Statistics" subtitle="Overview of your collection">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-blue-600">{decks.length}</div>
                <div className="text-sm text-muted-foreground">Total Decks</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-green-600">
                  {decks.reduce((acc, { deck }) => acc + deck.concepts.length, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Concepts</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-purple-600">
                  {decks.reduce((acc, { deck }) => acc + deck.concepts.length * 2, 0)}
                </div>
                <div className="text-sm text-muted-foreground">Total Cards</div>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <div className="text-2xl font-bold text-orange-600">
                  {Math.ceil(decks.reduce((acc, { deck }) => acc + deck.concepts.length * 1.5, 0))}
                </div>
                <div className="text-sm text-muted-foreground">Study Minutes</div>
              </CardContent>
            </Card>
          </div>
        </PageSection>

        <PageSection title="Bulk Actions" subtitle="Manage multiple decks at once">
          <div className="grid gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium">Refresh All Decks</h4>
                    <p className="text-sm text-muted-foreground">Reload all decks from storage</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={loadDecks}>
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Refresh
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </PageSection>
      </PageContent>
    </div>
  );

  const navigationItems: NavigationItem[] = [
    {
      id: 'browse',
      label: 'My Decks',
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
      id: 'import-export',
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
        variant="top"
        title="My Decks"
        description="Manage your learning decks"
      />
      
      {postDialog.fileName && postDialog.deck && (
        <PostDeckDialog
          fileName={postDialog.fileName}
          deck={postDialog.deck}
          isOpen={postDialog.isOpen}
          onClose={() => setPostDialog({ isOpen: false })}
          onSuccess={() => {
            console.log('Deck posted successfully!');
            setPostDialog({ isOpen: false });
          }}
        />
      )}
    </div>
  );
} 