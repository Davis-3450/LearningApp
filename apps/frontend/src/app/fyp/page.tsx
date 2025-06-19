'use client'

import { useState, useCallback } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Skeleton } from '@/components/ui/skeleton'
import { ArrowLeft, Search, Filter, TrendingUp, Heart, Share2, BookOpen, Users, Clock, Star } from 'lucide-react'
import { useRouter } from 'next/navigation'

// Mock data for the FYP
const trendingDecks = [
  {
    id: '1',
    title: 'JavaScript Fundamentals',
    description: 'Master the basics of JavaScript programming',
    author: 'CodeMaster',
    likes: 1245,
    studyTime: '2h 30m',
    difficulty: 'Beginner',
    tags: ['JavaScript', 'Programming', 'Web Dev'],
    thumbnail: '🚀'
  },
  {
    id: '2',
    title: 'French Vocabulary Essentials',
    description: 'Common French words for daily conversations',
    author: 'LanguagePro',
    likes: 892,
    studyTime: '1h 45m',
    difficulty: 'Intermediate',
    tags: ['French', 'Language', 'Vocabulary'],
    thumbnail: '🇫🇷'
  },
  {
    id: '3',
    title: 'Chemistry Periodic Table',
    description: 'Elements, properties, and chemical reactions',
    author: 'ScienceGeek',
    likes: 673,
    studyTime: '3h 15m',
    difficulty: 'Advanced',
    tags: ['Chemistry', 'Science', 'Elements'],
    thumbnail: '⚗️'
  }
]

const forYouDecks = [
  {
    id: '4',
    title: 'Python Data Structures',
    description: 'Lists, dictionaries, sets, and more',
    author: 'DataWiz',
    likes: 567,
    studyTime: '2h 00m',
    difficulty: 'Intermediate',
    tags: ['Python', 'Data Structures', 'Programming'],
    thumbnail: '🐍',
    recommended: true
  },
  {
    id: '5',
    title: 'Spanish Conjugations',
    description: 'Master verb conjugations in Spanish',
    author: 'EspañolExpert',
    likes: 421,
    studyTime: '1h 30m',
    difficulty: 'Beginner',
    tags: ['Spanish', 'Grammar', 'Verbs'],
    thumbnail: '🇪🇸',
    recommended: true
  }
]

const popularTags = ['JavaScript', 'Python', 'Spanish', 'Math', 'Science', 'History', 'Art']

function DeckCard({ deck, isRecommended = false }: { deck: any, isRecommended?: boolean }) {
  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty.toLowerCase()) {
      case 'beginner': return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300'
      case 'intermediate': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
      case 'advanced': return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300'
    }
  }

  return (
    <Card className="relative overflow-hidden hover:shadow-md transition-all duration-200 group">
      {isRecommended && (
        <div className="absolute top-2 left-2 z-10">
          <Badge variant="secondary" className="bg-primary/10 text-primary border-primary/20">
            <Star className="h-3 w-3 mr-1" />
            For You
          </Badge>
        </div>
      )}
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="text-3xl mb-2">{deck.thumbnail}</div>
          <div className="flex gap-1">
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="h-8 w-8 p-0 opacity-0 group-hover:opacity-100 transition-opacity">
              <Share2 className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <CardTitle className="text-lg leading-tight">{deck.title}</CardTitle>
        <CardDescription className="text-sm">{deck.description}</CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="flex flex-wrap gap-1 mb-3">
          {deck.tags.slice(0, 2).map((tag: string) => (
            <Badge key={tag} variant="outline" className="text-xs">
              {tag}
            </Badge>
          ))}
        </div>
        
        <div className="flex items-center justify-between text-sm text-muted-foreground mb-3">
          <span className="flex items-center gap-1">
            <Users className="h-3 w-3" />
            {deck.author}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {deck.studyTime}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <Badge className={getDifficultyColor(deck.difficulty)}>
            {deck.difficulty}
          </Badge>
          <div className="flex items-center gap-1 text-sm text-muted-foreground">
            <Heart className="h-3 w-3" />
            {deck.likes}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

function LoadingSkeleton() {
  return (
    <Card>
      <CardHeader>
        <Skeleton className="h-12 w-12 rounded-lg mb-2" />
        <Skeleton className="h-5 w-3/4" />
        <Skeleton className="h-4 w-full" />
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-3">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-5 w-20" />
        </div>
        <div className="flex justify-between items-center mb-3">
          <Skeleton className="h-4 w-20" />
          <Skeleton className="h-4 w-16" />
        </div>
        <div className="flex justify-between items-center">
          <Skeleton className="h-5 w-16" />
          <Skeleton className="h-4 w-8" />
        </div>
      </CardContent>
    </Card>
  )
}

export default function FYPPage() {
  const router = useRouter()
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedTags, setSelectedTags] = useState<string[]>([])
  const [isLoading, setIsLoading] = useState(false)

  const handleSearch = useCallback((query: string) => {
    setSearchQuery(query)
    setIsLoading(true)
    setTimeout(() => setIsLoading(false), 1000)
  }, [])

  const toggleTag = (tag: string) => {
    setSelectedTags(prev => 
      prev.includes(tag) 
        ? prev.filter(t => t !== tag)
        : [...prev, tag]
    )
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">For You</h1>
            <Button variant="ghost" size="icon">
              <Filter className="h-4 w-4" />
            </Button>
          </div>
          
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search decks, topics, creators..."
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10"
            />
          </div>
          
          {/* Filter Tags */}
          <div className="flex gap-2 mt-3 overflow-x-auto pb-2">
            {popularTags.map((tag) => (
              <Button
                key={tag}
                variant={selectedTags.includes(tag) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleTag(tag)}
                className="whitespace-nowrap"
              >
                {tag}
              </Button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Trending Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <TrendingUp className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Trending Now</h2>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(3)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {trendingDecks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} />
              ))}
            </div>
          )}
        </section>

        {/* For You Section */}
        <section>
          <div className="flex items-center gap-2 mb-4">
            <Star className="h-5 w-5 text-primary" />
            <h2 className="text-lg font-semibold">Recommended for You</h2>
            <Badge variant="secondary" className="text-xs">New</Badge>
          </div>
          
          {isLoading ? (
            <div className="grid gap-4 md:grid-cols-2">
              {[...Array(2)].map((_, i) => (
                <LoadingSkeleton key={i} />
              ))}
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {forYouDecks.map((deck) => (
                <DeckCard key={deck.id} deck={deck} isRecommended />
              ))}
            </div>
          )}
        </section>

        {/* Discover More */}
        <section>
          <h2 className="text-lg font-semibold mb-4">Discover More</h2>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <BookOpen className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Browse by Subject</h3>
                <p className="text-sm text-muted-foreground">Explore decks by academic subjects</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <Users className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Top Creators</h3>
                <p className="text-sm text-muted-foreground">Follow your favorite content creators</p>
              </CardContent>
            </Card>
            <Card className="hover:shadow-md transition-shadow cursor-pointer">
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-primary" />
                <h3 className="font-medium mb-1">Popular This Week</h3>
                <p className="text-sm text-muted-foreground">See what's trending in learning</p>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
} 