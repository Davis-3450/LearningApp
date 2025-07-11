'use client';

import { Navigation } from '@/components/layout/navigation';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Clock, Users, Target, TrendingUp, Zap } from 'lucide-react';
import { topics } from '@/lib/mock-data';
import { Topic } from '@/lib/types';
import { useDecks } from '@/lib/hooks/use-decks';
import { AsyncBoundary } from '@/components/ui/async-boundary';
import { DeckCard } from '@/components/deck/deck-card';
import { CardGrid } from '@/components/ui/card-grid';
import type { Deck } from '@/shared/schemas/deck';
import Link from 'next/link';
import { useState } from 'react';

const TopicSection = ({ topic, deckItems }: { topic: Topic; deckItems: Array<{ fileName: string; deck: Deck }> }) => {
  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Topic Header */}
      <div className="flex items-center gap-3 mb-4 sm:mb-6">
        <div className={`p-2 sm:p-3 rounded-lg ${topic.color}`}>
          <span className="text-xl sm:text-2xl">{topic.icon}</span>
        </div>
        <div className="min-w-0 flex-1">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">
            {topic.name}
          </h2>
          <p className="text-sm sm:text-base text-gray-600 dark:text-gray-400 line-clamp-2">
            {topic.description}
          </p>
        </div>
      </div>

      {/* Decks Grid */}
      {deckItems.length > 0 && (
        <div className="space-y-3 sm:space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              ({deckItems.length} deck{deckItems.length !== 1 ? 's' : ''})
            </span>
          </div>
          <CardGrid>
            {deckItems.map(({ fileName, deck }) => (
              <DeckCard key={deck.id} deck={deck} fileName={fileName} />
            ))}
          </CardGrid>
        </div>
      )}
    </div>
  );
};

const StatsCard = ({ title, value, description, icon: Icon }: {
  title: string;
  value: string | number;
  description: string;
  icon: React.ElementType;
}) => (
  <Card className="h-full">
    <CardContent className="p-4 sm:p-6">
      <div className="flex items-center justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400 truncate">{title}</p>
          <p className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400 line-clamp-2">{description}</p>
        </div>
        <Icon className="h-6 w-6 sm:h-8 sm:w-8 text-gray-400 flex-shrink-0 ml-2" />
      </div>
    </CardContent>
  </Card>
);

export default function Home() {
  const [activeTab, setActiveTab] = useState<string>('all');
  const { data: deckItems = [], isLoading, error, refetch } = useDecks();

  // Group decks by topic (we'll use a simple title-based grouping for now)
  const groupedDeckItems = topics.reduce((acc, topic) => {
    acc[topic.id] = deckItems.filter(({ deck }) => 
      deck.title.toLowerCase().includes(topic.name.toLowerCase()) ||
      (deck.description && deck.description.toLowerCase().includes(topic.name.toLowerCase()))
    );
    return acc;
  }, {} as Record<string, Array<{ fileName: string; deck: Deck }>>);

  // Calculate statistics
  const totalConcepts = deckItems.reduce((acc, { deck }) => acc + deck.concepts.length, 0);
  const avgConceptsPerDeck = deckItems.length > 0 ? Math.round(totalConcepts / deckItems.length) : 0;
  const totalFlashcards = totalConcepts * 2; // Each concept generates 2 flashcards

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      <Navigation />
      
      <div className="container mx-auto px-4 py-4 sm:py-8">
        {/* Hero Section */}
        <div className="text-center mb-8 sm:mb-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-gray-900 dark:text-white mb-4">
            Master Any Subject
          </h1>
          <p className="text-lg sm:text-xl text-gray-600 dark:text-gray-400 mb-8 max-w-3xl mx-auto">
            Create custom learning decks, study with flashcards, take quizzes, and track your progress across {topics.length} different topics.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button asChild size="lg" className="text-lg px-8">
              <Link href="/decks/create">
                <Plus className="mr-2 h-5 w-5" />
                Create Your First Deck
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="text-lg px-8">
              <Link href="/decks">
                <BookOpen className="mr-2 h-5 w-5" />
                Browse Existing Decks
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6 mb-8 sm:mb-12">
          <StatsCard
            title="Total Concepts"
            value={totalConcepts}
            description="Ready to study"
            icon={BookOpen}
          />
          <StatsCard
            title="Flashcards"
            value={totalFlashcards}
            description="Generated from concepts"
            icon={Clock}
          />
          <StatsCard
            title="Average Deck Size"
            value={avgConceptsPerDeck}
            description="Concepts per deck"
            icon={Target}
          />
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8 sm:mb-12">
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/decks/create">
              <CardContent className="p-6 text-center">
                <Plus className="h-8 w-8 mx-auto mb-3 text-blue-600" />
                <h3 className="font-semibold mb-2">Create Deck</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Build custom learning content</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/decks/ai-generate">
              <CardContent className="p-6 text-center">
                <Zap className="h-8 w-8 mx-auto mb-3 text-purple-600" />
                <h3 className="font-semibold mb-2">AI Generate</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Let AI create content for you</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <Link href="/decks">
              <CardContent className="p-6 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-3 text-green-600" />
                <h3 className="font-semibold mb-2">Browse Decks</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">Explore existing content</p>
              </CardContent>
            </Link>
          </Card>
          
          <Card className="hover:shadow-md transition-shadow cursor-pointer">
            <CardContent className="p-6 text-center">
              <TrendingUp className="h-8 w-8 mx-auto mb-3 text-orange-600" />
              <h3 className="font-semibold mb-2">Progress</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">Track your learning journey</p>
            </CardContent>
          </Card>
        </div>

        {/* Topic Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          {/* Mobile Topic Selector */}
          <div className="sm:hidden">
            <select
              value={activeTab}
              onChange={(e) => setActiveTab(e.target.value)}
              className="w-full p-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white"
            >
              <option value="all">All Topics</option>
              {topics.map((topic) => (
                <option key={topic.id} value={topic.id}>
                  {topic.icon} {topic.name}
                </option>
              ))}
            </select>
          </div>

          {/* Desktop Tabs */}
          <TabsList className="hidden sm:grid w-full grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            {topics.map((topic) => (
              <TabsTrigger key={topic.id} value={topic.id} className="flex items-center gap-2">
                <span>{topic.icon}</span>
                <span className="hidden lg:inline">{topic.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Topics View */}
          <TabsContent value="all" className="space-y-8 sm:space-y-12">
            <AsyncBoundary 
              loading={isLoading} 
              error={error} 
              onRetry={refetch}
            >
              {topics.map((topic) => {
                const topicDeckItems = groupedDeckItems[topic.id];
                return topicDeckItems.length > 0 ? (
                  <TopicSection key={topic.id} topic={topic} deckItems={topicDeckItems} />
                ) : null;
              })}
            </AsyncBoundary>
          </TabsContent>

          {/* Individual Topic Views */}
          {topics.map((topic) => (
            <TabsContent key={topic.id} value={topic.id}>
              <AsyncBoundary 
                loading={isLoading} 
                error={error} 
                onRetry={refetch}
              >
                <TopicSection topic={topic} deckItems={groupedDeckItems[topic.id]} />
              </AsyncBoundary>
            </TabsContent>
          ))}
        </Tabs>

        {/* Empty State */}
        <AsyncBoundary 
          loading={isLoading} 
          error={error} 
          onRetry={refetch}
        >
          {deckItems.length === 0 && (
            <div className="text-center py-12">
              <BookOpen className="mx-auto h-12 w-12 text-gray-400" />
              <h3 className="mt-4 text-lg font-medium text-gray-900 dark:text-white">
                No decks yet
              </h3>
              <p className="mt-2 text-gray-500 px-4">
                Create your first learning deck to get started
              </p>
              <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
                <Button asChild className="w-full sm:w-auto">
                  <Link href="/decks/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Your First Deck
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full sm:w-auto">
                  <Link href="/decks">
                    <BookOpen className="mr-2 h-4 w-4" />
                    Browse Decks
                  </Link>
                </Button>
              </div>
            </div>
          )}
        </AsyncBoundary>
      </div>
    </div>
  );
}