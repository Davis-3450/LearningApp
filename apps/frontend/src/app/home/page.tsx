'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Plus, Zap, BookOpen, TrendingUp, Clock, BarChart3, Target, Award, Brain, Play, Heart, Share, Sparkles } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { DecksAPI } from '@/lib/api/decks'
import type { Deck } from '@/shared/schemas/deck'
import { logger } from '@/lib/logger'
import { 
  PageLayout, 
  PageHeader, 
  PageContent, 
  PageSection, 
  StatsGrid, 
  ContentGrid, 
  LoadingGrid 
} from '@/components/ui/page-layout'
import { 
  DeckCard, 
  StatsCard, 
  QuickStartCard, 
  EmptyStateCard 
} from '@/components/ui/common-cards'

const recentDecks = [
  {
    id: '1',
    title: 'Spanish Basics',
    progress: 65,
    totalCards: 50,
    studiedToday: 12,
    lastStudied: '2 hours ago',
    streak: 5,
    thumbnail: '🇪🇸'
  },
  {
    id: '2',
    title: 'JavaScript Fundamentals',
    progress: 32,
    totalCards: 75,
    studiedToday: 8,
    lastStudied: '1 day ago',
    streak: 3,
    thumbnail: '🚀'
  },
  {
    id: '3',
    title: 'Chemistry Elements',
    progress: 89,
    totalCards: 30,
    studiedToday: 0,
    lastStudied: '3 days ago',
    streak: 0,
    thumbnail: '⚗️'
  }
]

const dailyStats = {
  cardsStudied: 28,
  minutesSpent: 45,
  streak: 7,
  accuracy: 85
}

const quickActions = [
  { id: 'create', label: 'Create Deck', icon: Plus, color: 'bg-blue-500', href: '/decks/create' },
  { id: 'ai', label: 'AI Generate', icon: Zap, color: 'bg-purple-500', href: '/decks/ai-generate' },
  { id: 'browse', label: 'Browse Decks', icon: BookOpen, color: 'bg-green-500', href: '/decks' },
  { id: 'trends', label: 'Trending', icon: TrendingUp, color: 'bg-orange-500', href: '/fyp' }
]

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
)

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
)

export default function HomePage() {
  const router = useRouter()
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })
  const [deckItems, setDeckItems] = useState<DeckWithFileName[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadDecks()
  }, [])

  const loadDecks = async () => {
    try {
      const response = await DecksAPI.getAll()
      if (response.success && response.data) {
        setDeckItems(response.data)
      }
    } catch (error) {
      logger.error('Failed to load decks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Calculate statistics
  const totalConcepts = deckItems.reduce((acc, { deck }) => acc + deck.concepts.length, 0)
  const totalFlashcards = totalConcepts * 2

  const headerActions = (
    <Button size="sm" asChild>
      <Link href="/decks/create">
        <Plus className="h-4 w-4" />
      </Link>
    </Button>
  )

  const quickStartActions = [
    {
      href: '/decks/create',
      icon: Plus,
      title: 'Create New Deck',
      subtitle: 'Build custom content',
      variant: 'default' as const
    },
    {
      href: '/decks/ai-generate',
      icon: Sparkles,
      title: 'AI Generate',
      subtitle: 'Let AI create for you',
      variant: 'outline' as const
    }
  ]

  const sectionActions = (
    <Button variant="ghost" size="sm" asChild>
      <Link href="/decks">View All</Link>
    </Button>
  )

  return (
    <PageLayout>
      <PageHeader
        title="Learning App"
        subtitle="Your study companion"
        actions={headerActions}
      />

      <PageContent>
        {/* Quick Stats */}
        <StatsGrid columns={3}>
          <StatsCard icon={BookOpen} label="Decks" value={deckItems.length} color="text-blue-600" />
          <StatsCard icon={Target} label="Cards" value={totalFlashcards} color="text-green-600" />
          <StatsCard icon={Clock} label="Minutes" value={Math.ceil(totalConcepts * 1.5)} color="text-purple-600" />
        </StatsGrid>

        {/* Quick Actions */}
        <QuickStartCard actions={quickStartActions} />

        {/* Recent Decks */}
        <PageSection title="Your Decks" actions={sectionActions}>
          {loading ? (
            <LoadingGrid count={3} />
          ) : deckItems.length > 0 ? (
            <ContentGrid>
              {deckItems.slice(0, 5).map(({ fileName, deck }) => (
                <DeckCard key={deck.id} deck={deck} fileName={fileName} />
              ))}
            </ContentGrid>
          ) : (
            <EmptyStateCard
              icon={BookOpen}
              title="No decks yet"
              description="Create your first deck to start learning"
              action={
                <Button asChild>
                  <Link href="/decks/create">
                    <Plus className="mr-2 h-4 w-4" />
                    Create Deck
                  </Link>
                </Button>
              }
            />
          )}
        </PageSection>
      </PageContent>
    </PageLayout>
  )
} 