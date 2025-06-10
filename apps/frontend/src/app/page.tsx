'use client';

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, BookOpen, Play, Clock, Users, Shapes, TrendingUp, Target, Award } from 'lucide-react';
import { mockDecks, topics } from '@/lib/mock-data';
import { Deck, Topic } from '@/lib/types';
import Link from 'next/link';

const difficultyColors = {
  'beginner': 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200',
  'intermediate': 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200',
  'advanced': 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
};

const DifficultyBadge = ({ difficulty }: { difficulty: string }) => (
  <Badge className={difficultyColors[difficulty as keyof typeof difficultyColors] || 'bg-gray-100 text-gray-800'}>
    {difficulty}
  </Badge>
);

const DeckCard = ({ deck }: { deck: Deck }) => (
  <Card className="hover:shadow-lg transition-all hover:scale-[1.02]">
    <CardHeader>
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <CardTitle className="text-lg mb-2">{deck.title}</CardTitle>
          <CardDescription className="mb-3">
            {deck.description}
          </CardDescription>
          <div className="flex items-center gap-2 mb-2">
            <DifficultyBadge difficulty={deck.difficulty} />
            {deck.estimatedTime && (
              <Badge variant="outline" className="text-xs">
                <Clock className="mr-1 h-3 w-3" />
                {deck.estimatedTime}m
              </Badge>
            )}
          </div>
        </div>
        <div className={`w-4 h-4 rounded-full ${deck.color}`} />
      </div>
    </CardHeader>
    <CardContent>
      <div className="flex items-center justify-between mb-4">
        <span className="text-sm text-gray-500 flex items-center gap-1">
          <Users className="h-4 w-4" />
          {deck.cardCount || deck.cards.length} cards
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
      <Button variant="secondary" size="sm" asChild className="w-full mt-2">
        <Link href={`/game/matching/${deck.id}`}>
          <Shapes className="mr-2 h-4 w-4" />
          Matching Game
        </Link>
      </Button>
    </CardContent>
  </Card>
);

const TopicSection = ({ topic, decks }: { topic: Topic; decks: Deck[] }) => {
  const groupedByDifficulty = {
    beginner: decks.filter(d => d.difficulty === 'beginner'),
    intermediate: decks.filter(d => d.difficulty === 'intermediate'),
    advanced: decks.filter(d => d.difficulty === 'advanced')
  };

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

      {/* Difficulty Sections */}
      {Object.entries(groupedByDifficulty).map(([difficulty, difficultyDecks]) => (
        difficultyDecks.length > 0 && (
          <div key={difficulty} className="space-y-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200 capitalize">
                {difficulty}
              </h3>
              <DifficultyBadge difficulty={difficulty} />
              <span className="text-sm text-gray-500">
                ({difficultyDecks.length} deck{difficultyDecks.length !== 1 ? 's' : ''})
              </span>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {difficultyDecks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} />
              ))}
            </div>
          </div>
        )
      ))}
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
  const [decks] = useState<Deck[]>(mockDecks);
  const [activeTab, setActiveTab] = useState<string>('all');

  const groupedDecks = topics.reduce((acc, topic) => {
    acc[topic.id] = decks.filter(deck => deck.topicId === topic.id);
    return acc;
  }, {} as Record<string, Deck[]>);

  // Calculate statistics
  const totalCards = decks.reduce((acc, deck) => acc + deck.cards.length, 0);
  const avgCardsPerDeck = Math.round(totalCards / decks.length);
  const totalEstimatedTime = decks.reduce((acc, deck) => acc + (deck.estimatedTime || 0), 0);

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
              Explore {decks.length} learning decks across {topics.length} topics
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
            title="Total Cards"
            value={totalCards}
            description="Ready to study"
            icon={BookOpen}
          />
          <StatsCard
            title="Study Time"
            value={`${totalEstimatedTime}m`}
            description="Total estimated time"
            icon={Clock}
          />
          <StatsCard
            title="Average Deck Size"
            value={avgCardsPerDeck}
            description="Cards per deck"
            icon={Target}
          />
        </div>

        {/* Topic Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4 lg:grid-cols-7">
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
            {topics.map((topic) => {
              const topicDecks = groupedDecks[topic.id];
              return topicDecks.length > 0 ? (
                <TopicSection key={topic.id} topic={topic} decks={topicDecks} />
              ) : null;
            })}
          </TabsContent>

          {/* Individual Topic Views */}
          {topics.map((topic) => (
            <TabsContent key={topic.id} value={topic.id}>
              <TopicSection topic={topic} decks={groupedDecks[topic.id]} />
            </TabsContent>
          ))}
        </Tabs>

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
