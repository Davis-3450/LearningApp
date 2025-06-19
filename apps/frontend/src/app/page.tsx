'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { NavigationMenu, NavigationItem } from '@/components/ui/navigation-menu';
import { useTheme } from 'next-themes';
import { useRouter } from 'next/navigation';
import { 
  Home, 
  Search, 
  Settings, 
  Plus, 
  BookOpen, 
  Play, 
  Users, 
  Shapes, 
  Target, 
  Clock, 
  TrendingUp,
  Heart,
  Share,
  Download,
  Filter,
  Sparkles,
  Fire,
  Star,
  Zap,
  Eye,
  Type,
  Monitor,
  Accessibility,
  Info,
  RotateCcw,
  Palette
} from 'lucide-react';
import { availableThemes, themeColors } from '@/components/theme-provider';
import ThemePreview from '@/components/theme-preview';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { topics } from '@/lib/mock-data';
import { Topic } from '@/lib/types';
import { DecksAPI } from '@/lib/api/decks';
import type { Deck } from '@/shared/schemas/deck';
import Link from 'next/link';

interface DeckWithFileName {
  fileName: string;
  deck: Deck;
}

// Mobile-friendly deck card for feed
const FeedDeckCard = ({ deck, fileName }: { deck: Deck; fileName: string }) => (
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
              {deck.concepts.length} cards
            </Badge>
            <Badge variant="secondary" className="text-xs h-5">
              {deck.difficulty || 'Medium'}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            <Button size="sm" className="h-7 text-xs flex-1" asChild>
          <Link href={`/game/flashcard/${fileName}`}>
                <Play className="mr-1 h-3 w-3" />
            Study
          </Link>
        </Button>
            <Button variant="outline" size="sm" className="h-7 px-2">
              <Heart className="h-3 w-3" />
        </Button>
            <Button variant="outline" size="sm" className="h-7 px-2">
              <Share className="h-3 w-3" />
      </Button>
          </div>
        </div>
      </div>
    </CardContent>
  </Card>
);

// Compact stats card for mobile
const StatCard = ({ icon: Icon, label, value, color = "text-primary" }: {
  icon: React.ElementType;
  label: string;
  value: string | number;
  color?: string;
}) => (
  <div className="text-center p-3 rounded-lg border">
    <Icon className={`h-5 w-5 mx-auto mb-1 ${color}`} />
    <div className={`text-lg font-bold ${color}`}>{value}</div>
    <div className="text-xs text-muted-foreground">{label}</div>
  </div>
);

export default function MobileApp() {
  const { theme, setTheme } = useTheme();
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [deckItems, setDeckItems] = useState<DeckWithFileName[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFilter, setSelectedFilter] = useState('all');
  
  // Settings state
  const [fontSize, setFontSize] = useState([16]);
  const [studySettings, setStudySettings] = useState({
    defaultGameType: 'flashcard',
    autoAdvance: true,
    autoAdvanceDelay: [3],
    showHints: true,
    difficultyLevel: 'medium'
  });

  useEffect(() => {
    setMounted(true);
    loadDecks();
    loadSettings();
  }, []);

    const loadDecks = async () => {
      try {
        const response = await DecksAPI.getAll();
        if (response.success && response.data) {
          setDeckItems(response.data);
        }
      } catch (error) {
        console.error('Failed to load decks:', error);
      } finally {
        setLoading(false);
      }
    };

  const loadSettings = () => {
    const savedFontSize = localStorage.getItem('fontSize');
    const savedStudySettings = localStorage.getItem('studySettings');
    
    if (savedFontSize) setFontSize([parseInt(savedFontSize)]);
    if (savedStudySettings) setStudySettings(JSON.parse(savedStudySettings));
  };

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value));
  };

  // Filter decks based on search and filter
  const filteredDecks = deckItems.filter(({ deck }) => {
    const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()));
    
    if (selectedFilter === 'all') return matchesSearch;
    return matchesSearch && deck.difficulty === selectedFilter;
  });

  // Calculate statistics
  const totalConcepts = deckItems.reduce((acc, { deck }) => acc + deck.concepts.length, 0);
  const totalFlashcards = totalConcepts * 2;

  // HOME CONTENT - Main dashboard
  const HomeContent = () => (
    <div className="pb-20">
        {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-xl font-bold">Learning App</h1>
            <p className="text-sm text-muted-foreground">Your study companion</p>
          </div>
          <Button size="sm" asChild>
            <Link href="/decks/create">
              <Plus className="h-4 w-4" />
            </Link>
          </Button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-3 gap-3">
          <StatCard icon={BookOpen} label="Decks" value={deckItems.length} color="text-blue-600" />
          <StatCard icon={Target} label="Cards" value={totalFlashcards} color="text-green-600" />
          <StatCard icon={Clock} label="Minutes" value={Math.ceil(totalConcepts * 1.5)} color="text-purple-600" />
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Quick Start</CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button asChild className="w-full justify-start h-12">
              <Link href="/decks/create">
                <Plus className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">Create New Deck</div>
                  <div className="text-xs text-primary-foreground/80">Build custom content</div>
                </div>
              </Link>
            </Button>
            <Button asChild variant="outline" className="w-full justify-start h-12">
              <Link href="/decks/ai-generate">
                <Sparkles className="mr-3 h-5 w-5" />
                <div className="text-left">
                  <div className="font-medium">AI Generate</div>
                  <div className="text-xs text-muted-foreground">Let AI create for you</div>
                </div>
              </Link>
            </Button>
          </CardContent>
        </Card>

        {/* Recent Decks */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Your Decks</h2>
            <Button variant="ghost" size="sm" asChild>
              <Link href="/decks">View All</Link>
            </Button>
          </div>
          
          {loading ? (
            <div className="space-y-3">
              {[1,2,3].map(i => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : deckItems.length > 0 ? (
            <div className="space-y-3">
              {deckItems.slice(0, 5).map(({ fileName, deck }) => (
                <FeedDeckCard key={deck.id} deck={deck} fileName={fileName} />
              ))}
            </div>
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <BookOpen className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">No decks yet</h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Create your first deck to start learning
                </p>
                <Button asChild>
                  <Link href="/decks/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Deck
                  </Link>
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // FYP CONTENT - Search and feed
  const FypContent = () => (
    <div className="pb-20">
      {/* Search Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4 space-y-3">
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search decks..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
          <Button variant="outline" size="icon">
            <Filter className="h-4 w-4" />
          </Button>
        </div>

        {/* Filter tabs */}
        <div className="flex gap-2 overflow-x-auto">
          {['all', 'beginner', 'intermediate', 'advanced'].map((filter) => (
            <Button
              key={filter}
              variant={selectedFilter === filter ? "default" : "outline"}
              size="sm"
              onClick={() => setSelectedFilter(filter)}
              className="whitespace-nowrap capitalize"
            >
              {filter === 'all' ? 'All' : filter}
            </Button>
          ))}
        </div>
      </div>

      <div className="p-4 space-y-4">
        {/* Trending Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Fire className="h-5 w-5 text-orange-500" />
            <h2 className="text-lg font-semibold">Trending</h2>
          </div>
          
            {loading ? (
            <div className="space-y-3">
              {[1,2].map(i => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
              </div>
            ) : (
            <div className="space-y-3">
              {filteredDecks.slice(0, 2).map(({ fileName, deck }) => (
                <FeedDeckCard key={deck.id} deck={deck} fileName={fileName} />
              ))}
            </div>
          )}
        </div>

        {/* For You Section */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="h-5 w-5 text-purple-500" />
            <h2 className="text-lg font-semibold">For You</h2>
          </div>
          
              {loading ? (
            <div className="space-y-3">
              {[1,2,3,4].map(i => (
                <div key={i} className="h-20 bg-muted rounded-lg animate-pulse" />
              ))}
            </div>
          ) : filteredDecks.length > 0 ? (
            <div className="space-y-3">
              {filteredDecks.map(({ fileName, deck }) => (
                <FeedDeckCard key={deck.id} deck={deck} fileName={fileName} />
              ))}
                </div>
              ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-8">
                <Search className="h-12 w-12 text-muted-foreground mb-3" />
                <h3 className="font-semibold mb-2">No decks found</h3>
                <p className="text-sm text-muted-foreground text-center">
                  Try adjusting your search or filters
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );

  // SETTINGS CONTENT - Compact settings for mobile
  const SettingsContent = () => (
    <div className="pb-20">
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b p-4">
        <h1 className="text-xl font-bold">Settings</h1>
        <p className="text-sm text-muted-foreground">Customize your experience</p>
      </div>

      <div className="p-4 space-y-4">
        {/* Theme */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Palette className="h-4 w-4" />
              Theme
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {availableThemes.map((t) => (
                  <SelectItem key={t} value={t} className="capitalize">
                    <div className="flex items-center gap-2">
                      <span
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: themeColors[t] }}
                      />
                      {t}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-4 gap-2">
              {availableThemes.slice(0, 8).map((t) => (
                <button
                  key={t}
                  onClick={() => setTheme(t)}
                  className={`aspect-square rounded-lg p-2 border-2 transition-all ${
                    t === theme ? 'border-primary scale-95' : 'border-transparent'
                  }`}
                  style={{ backgroundColor: themeColors[t] }}
                />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Font Size */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Type className="h-4 w-4" />
              Font Size
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <div className="flex justify-between text-sm">
              <span>Size: {fontSize[0]}px</span>
              <span className="text-muted-foreground">12px - 24px</span>
            </div>
            <Slider
              value={fontSize}
              onValueChange={(value) => {
                setFontSize(value)
                saveToLocalStorage('fontSize', value[0])
              }}
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
          </CardContent>
        </Card>

        {/* Study Settings */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Study Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium">Default Study Mode</label>
              <Select 
                value={studySettings.defaultGameType} 
                onValueChange={(value) => {
                  const newSettings = { ...studySettings, defaultGameType: value }
                  setStudySettings(newSettings)
                  saveToLocalStorage('studySettings', newSettings)
                }}
              >
                <SelectTrigger className="mt-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="flashcard">Flashcards</SelectItem>
                  <SelectItem value="quiz">Quiz</SelectItem>
                  <SelectItem value="matching">Matching</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Auto-advance</span>
              <Button
                variant={studySettings.autoAdvance ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newSettings = { ...studySettings, autoAdvance: !studySettings.autoAdvance }
                  setStudySettings(newSettings)
                  saveToLocalStorage('studySettings', newSettings)
                }}
              >
                {studySettings.autoAdvance ? "On" : "Off"}
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account & Data */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-base flex items-center gap-2">
              <Settings className="h-4 w-4" />
              Data & Privacy
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button variant="outline" className="w-full justify-start" asChild>
              <Link href="/decks">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Decks
              </Link>
            </Button>
            <Button variant="outline" className="w-full justify-start">
              <Download className="mr-2 h-4 w-4" />
              Export Data
            </Button>
            <Button variant="destructive" className="w-full justify-start">
              <RotateCcw className="mr-2 h-4 w-4" />
              Reset Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );

  if (!mounted) return null;

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      shortLabel: 'Home',
      icon: Home,
      content: <HomeContent />
    },
    {
      id: 'fyp',
      label: 'For You',
      shortLabel: 'FYP',
      icon: Search,
      content: <FypContent />
    },
    {
      id: 'settings',
      label: 'Settings',
      shortLabel: 'Settings',
      icon: Settings,
      content: <SettingsContent />
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu
        items={navigationItems}
        defaultValue="home"
        variant="bottom"
        className="h-screen"
      />
    </div>
  );
}
