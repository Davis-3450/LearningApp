'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Play, Clock, Users, Shapes, TrendingUp, Target, Award } from 'lucide-react';
import { topics } from '@/lib/mock-data';
import { Topic } from '@/lib/types';
import { DecksAPI } from '@/lib/api/decks';
import type { Deck } from '@/shared/schemas/deck';
import Link from 'next/link';



const DeckCard = ({ deck, fileName }: { deck: Deck; fileName: string }) => (
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
              <Users className="mr-1 h-3 w-3" />
              {deck.concepts.length} concepts
            </Badge>
          </div>
        </div>
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <BookOpen className="h-4 w-4" />
          {deck.concepts.length * 2} flashcards
        </span>
      </div>
      
      <div className="flex gap-2">
        <Button variant="default" size="sm" asChild className="flex-1">
          <Link href={`/game/flashcard/${fileName}`}>
            <BookOpen className="mr-2 h-4 w-4" />
            Study
          </Link>
        </Button>
        <Button variant="outline" size="sm" asChild className="flex-1">
          <Link href={`/game/quiz/${fileName}`}>
            <Play className="mr-2 h-4 w-4" />
            Quiz
          </Link>
        </Button>
      </div>
      <Button variant="secondary" size="sm" asChild className="w-full mt-2">
        <Link href={`/game/matching/${fileName}`}>
          <Shapes className="mr-2 h-4 w-4" />
          Matching Game
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const TopicSection = ({ topic, deckItems }: { topic: Topic; deckItems: Array<{ fileName: string; deck: Deck }> }) => {
  return (
    <div className="space-y-6">
      {/* Topic Header */}
      <div className="flex items-center gap-3 mb-6">
        <div className={`p-3 rounded-lg ${topic.color}`}>
          <span className="text-2xl">{topic.icon}</span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            {topic.name}
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            {topic.description}
          </p>
        </div>
      </div>

      {/* Decks Grid */}
      {deckItems.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">
              ({deckItems.length} deck{deckItems.length !== 1 ? 's' : ''})
            </span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {deckItems.map(({ fileName, deck }) => (
              <DeckCard key={deck.id} deck={deck} fileName={fileName} />
            ))}
          </div>
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
  <Card>
    <CardContent className="p-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600 dark:text-gray-400">{title}</p>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">{value}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{description}</p>
        </div>
        <Icon className="h-8 w-8 text-gray-400" />
      </div>
    </CardContent>
  </Card>
);

export default function Home() {
  const [deckItems, setDeckItems] = useState<Array<{ fileName: string; deck: Deck }>>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>('all');

  useEffect(() => {
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

    loadDecks();
  }, []);

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
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
              Learning App
            </h1>
            <p className="text-gray-600 dark:text-gray-400 mt-2">
              Explore {deckItems.length} learning decks across {topics.length} topics
            </p>
          </div>
          <div className="flex gap-3">
            <Button asChild variant="outline">
              <Link href="/decks">
                <BookOpen className="mr-2 h-4 w-4" />
                Manage Decks
              </Link>
            </Button>
            <Button asChild>
              <Link href="/create">
                <Plus className="mr-2 h-4 w-4" />
                Create Deck
              </Link>
            </Button>
          </div>
        </div>

        {/* Statistics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
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

        {/* Topic Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-2 sm:grid-cols-4 lg:grid-cols-7">
            <TabsTrigger value="all">All Topics</TabsTrigger>
            {topics.map((topic) => (
              <TabsTrigger key={topic.id} value={topic.id} className="flex items-center gap-2">
                <span>{topic.icon}</span>
                <span className="hidden sm:inline">{topic.name}</span>
              </TabsTrigger>
            ))}
          </TabsList>

          {/* All Topics View */}
          <TabsContent value="all" className="space-y-12">
            {loading ? (
              <div className="text-center py-12">
                <p className="text-gray-500">Loading decks...</p>
              </div>
            ) : (
              topics.map((topic) => {
                const topicDeckItems = groupedDeckItems[topic.id];
                return topicDeckItems.length > 0 ? (
                  <TopicSection key={topic.id} topic={topic} deckItems={topicDeckItems} />
                ) : null;
              })
            )}
          </TabsContent>

          {/* Individual Topic Views */}
          {topics.map((topic) => (
            <TabsContent key={topic.id} value={topic.id}>
              {loading ? (
                <div className="text-center py-12">
                  <p className="text-gray-500">Loading decks...</p>
                </div>
              ) : (
                <TopicSection topic={topic} deckItems={groupedDeckItems[topic.id]} />
              )}
            </TabsContent>
          ))}
        </Tabs>

        {/* Empty State */}
        {!loading && deckItems.length === 0 && (
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
