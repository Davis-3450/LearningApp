'use client'

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { ArrowLeft, Plus, Zap, BookOpen, TrendingUp, Clock, BarChart3, Target, Award, Brain } from 'lucide-react'
import { useRouter } from 'next/navigation'

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

function StatCard({ icon: Icon, label, value, description, trend }: { 
  icon: any, label: string, value: string | number, description: string, trend?: string 
}) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">{label}</p>
              <p className="text-2xl font-bold">{value}</p>
            </div>
          </div>
          {trend && (
            <Badge variant="secondary" className="text-xs">
              {trend}
            </Badge>
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-2">{description}</p>
      </CardContent>
    </Card>
  )
}

function DeckCard({ deck }: { deck: any }) {
  const getProgressColor = (progress: number) => {
    if (progress >= 80) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    if (progress >= 20) return 'bg-yellow-500'
    return 'bg-red-500'
  }

  return (
    <Card className="hover:shadow-md transition-all duration-200 group cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-3">
            <div className="text-2xl">{deck.thumbnail}</div>
            <div className="flex-1">
              <CardTitle className="text-base">{deck.title}</CardTitle>
              <CardDescription className="text-sm">
                {deck.totalCards} cards • {deck.lastStudied}
              </CardDescription>
            </div>
          </div>
          {deck.streak > 0 && (
            <Badge variant="secondary" className="bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300">
              🔥 {deck.streak}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-3">
          <div>
            <div className="flex justify-between text-sm mb-1">
              <span className="text-muted-foreground">Progress</span>
              <span className="font-medium">{deck.progress}%</span>
            </div>
            <Progress value={deck.progress} className="h-2" />
          </div>
          
          <div className="flex justify-between items-center text-sm">
            <span className="text-muted-foreground">Studied today</span>
            <span className="font-medium">
              {deck.studiedToday > 0 ? `${deck.studiedToday} cards` : 'Not yet'}
            </span>
          </div>
        </div>
        
        <div className="flex gap-2 mt-4">
          <Button size="sm" className="flex-1">
            Continue
          </Button>
          <Button size="sm" variant="outline">
            Review
          </Button>
        </div>
      </CardContent>
    </Card>
  )
}

export default function HomePage() {
  const router = useRouter()
  const [greeting] = useState(() => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  })

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="sticky top-0 z-40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <Button variant="ghost" size="icon" onClick={() => router.back()}>
              <ArrowLeft className="h-4 w-4" />
            </Button>
            <h1 className="text-xl font-semibold">Learning Dashboard</h1>
            <Link href="/settings">
              <Button variant="ghost" size="icon">
                <BarChart3 className="h-4 w-4" />
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="container mx-auto px-4 py-6 space-y-8">
        {/* Welcome Section */}
        <section>
          <h2 className="text-2xl font-bold mb-2">{greeting}! 👋</h2>
          <p className="text-muted-foreground mb-6">Ready to continue your learning journey?</p>
          
          {/* Daily Stats */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              icon={Target}
              label="Cards Studied"
              value={dailyStats.cardsStudied}
              description="Today's progress"
              trend="+12%"
            />
            <StatCard
              icon={Clock}
              label="Minutes"
              value={dailyStats.minutesSpent}
              description="Time invested"
              trend="+5min"
            />
            <StatCard
              icon={Award}
              label="Day Streak"
              value={dailyStats.streak}
              description="Keep it up!"
              trend="🔥"
            />
            <StatCard
              icon={Brain}
              label="Accuracy"
              value={`${dailyStats.accuracy}%`}
              description="Average score"
              trend="+3%"
            />
          </div>
        </section>

        {/* Quick Actions */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {quickActions.map((action) => {
              const Icon = action.icon
              return (
                <Link key={action.id} href={action.href}>
                  <Card className="hover:shadow-md transition-all duration-200 group cursor-pointer">
                    <CardContent className="p-4 text-center">
                      <div className={`w-12 h-12 rounded-lg ${action.color} flex items-center justify-center mx-auto mb-3 group-hover:scale-110 transition-transform`}>
                        <Icon className="h-6 w-6 text-white" />
                      </div>
                      <h4 className="font-medium text-sm">{action.label}</h4>
                    </CardContent>
                  </Card>
                </Link>
              )
            })}
          </div>
        </section>

        {/* Recent Decks */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold">Your Decks</h3>
            <Link href="/decks">
              <Button variant="outline" size="sm">
                View All
              </Button>
            </Link>
          </div>
          
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {recentDecks.map((deck) => (
              <DeckCard key={deck.id} deck={deck} />
            ))}
          </div>
        </section>

        {/* Learning Insights */}
        <section>
          <h3 className="text-lg font-semibold mb-4">Learning Insights</h3>
          <div className="grid gap-4 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <TrendingUp className="h-4 w-4 text-primary" />
                  Weekly Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex justify-between text-sm">
                    <span>Cards mastered this week</span>
                    <span className="font-medium">127</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Study sessions</span>
                    <span className="font-medium">12</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span>Average session time</span>
                    <span className="font-medium">18 min</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center gap-2">
                  <Award className="h-4 w-4 text-primary" />
                  Achievements
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-yellow-100 dark:bg-yellow-900 flex items-center justify-center">
                      🏆
                    </div>
                    <div>
                      <p className="text-sm font-medium">Week Warrior</p>
                      <p className="text-xs text-muted-foreground">7-day study streak</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center">
                      🎯
                    </div>
                    <div>
                      <p className="text-sm font-medium">Accuracy Master</p>
                      <p className="text-xs text-muted-foreground">85%+ accuracy rate</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </section>
      </div>
    </div>
  )
} 