'use client'

import { useState, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Filter, TrendingUp, Sparkles } from 'lucide-react'
import { DecksAPI } from '@/lib/api/decks'
import type { Deck } from '@/shared/schemas/deck'
import { 
  PageLayout, 
  SearchHeader, 
  PageContent, 
  PageSection, 
  ContentGrid, 
  LoadingGrid,
  SectionHeader 
} from '@/components/ui/page-layout'
import { 
  DeckCard, 
  EmptyStateCard,
  FilterTabs 
} from '@/components/ui/common-cards'

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

interface DeckWithFileName {
  fileName: string;
  deck: Deck;
}

export default function FYPPage() {
  const [deckItems, setDeckItems] = useState<DeckWithFileName[]>([])
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedFilter, setSelectedFilter] = useState('all')

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
      console.error('Failed to load decks:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter decks based on search and filter
  const filteredDecks = deckItems.filter(({ deck }) => {
    const matchesSearch = deck.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (deck.description && deck.description.toLowerCase().includes(searchQuery.toLowerCase()))
    
    if (selectedFilter === 'all') return matchesSearch
    return matchesSearch && deck.difficulty === selectedFilter
  })

  const filterOptions = [
    { value: 'all', label: 'All' },
    { value: 'beginner', label: 'Beginner' },
    { value: 'intermediate', label: 'Intermediate' },
    { value: 'advanced', label: 'Advanced' }
  ]

  const searchActions = (
    <Button variant="outline" size="icon">
      <Filter className="h-4 w-4" />
    </Button>
  )

  return (
    <PageLayout>
      <SearchHeader
        searchValue={searchQuery}
        onSearchChange={setSearchQuery}
        placeholder="Search decks..."
        actions={searchActions}
      >
        <FilterTabs
          options={filterOptions}
          selected={selectedFilter}
          onSelect={setSelectedFilter}
        />
      </SearchHeader>

      <PageContent>
        {/* Trending Section */}
        <PageSection>
          <SectionHeader 
            icon={TrendingUp} 
            title="Trending" 
            iconColor="text-orange-500" 
          />
          
          {loading ? (
            <LoadingGrid count={2} />
          ) : (
            <ContentGrid>
              {filteredDecks.slice(0, 2).map(({ fileName, deck }) => (
                <DeckCard key={deck.id} deck={deck} fileName={fileName} />
              ))}
            </ContentGrid>
          )}
        </PageSection>

        {/* For You Section */}
        <PageSection>
          <SectionHeader 
            icon={Sparkles} 
            title="For You" 
            iconColor="text-purple-500" 
          />
          
          {loading ? (
            <LoadingGrid count={4} />
          ) : filteredDecks.length > 0 ? (
            <ContentGrid>
              {filteredDecks.map(({ fileName, deck }) => (
                <DeckCard key={deck.id} deck={deck} fileName={fileName} />
              ))}
            </ContentGrid>
          ) : (
            <EmptyStateCard
              icon={Filter}
              title="No decks found"
              description="Try adjusting your search or filters"
            />
          )}
        </PageSection>
      </PageContent>
    </PageLayout>
  )
} 