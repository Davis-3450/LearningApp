'use client'

import React from 'react'
import { NavigationMenu, NavigationItem } from '@/components/ui/navigation-menu'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { 
  Home, 
  BookOpen, 
  Settings, 
  User,
  TrendingUp,
  Clock,
  Target
} from 'lucide-react'

/**
 * Demo component showing how to use NavigationMenu with bottom mobile variant
 * This can be used as a reference for implementing mobile-first navigation throughout the app
 */
export function MobileNavigationDemo() {
  // Example content components
  const HomeContent = () => (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            Welcome Home
          </CardTitle>
          <CardDescription>Your learning dashboard</CardDescription>
        </CardHeader>
        <CardContent>
          <p>This is the home screen content. Perfect for mobile navigation.</p>
        </CardContent>
      </Card>
    </div>
  )

  const StudyContent = () => (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Study Session
          </CardTitle>
          <CardDescription>Continue your learning journey</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Your study materials and progress tracking are here.</p>
        </CardContent>
      </Card>
    </div>
  )

  const ProgressContent = () => (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progress Analytics
          </CardTitle>
          <CardDescription>Track your learning metrics</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Charts, statistics, and performance insights would go here.</p>
        </CardContent>
      </Card>
    </div>
  )

  const ProfileContent = () => (
    <div className="p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            User Profile
          </CardTitle>
          <CardDescription>Manage your account and preferences</CardDescription>
        </CardHeader>
        <CardContent>
          <p>Profile settings, achievements, and account management.</p>
        </CardContent>
      </Card>
    </div>
  )

  const navigationItems: NavigationItem[] = [
    {
      id: 'home',
      label: 'Home',
      shortLabel: 'Home',
      icon: Home,
      content: <HomeContent />
    },
    {
      id: 'study',
      label: 'Study',
      shortLabel: 'Study',
      icon: BookOpen,
      content: <StudyContent />
    },
    {
      id: 'progress',
      label: 'Progress',
      shortLabel: 'Stats',
      icon: TrendingUp,
      content: <ProgressContent />
    },
    {
      id: 'profile',
      label: 'Profile',
      shortLabel: 'Me',
      icon: User,
      content: <ProfileContent />
    }
  ]

  return (
    <NavigationMenu
      items={navigationItems}
      defaultValue="home"
      variant="bottom"
      title="Learning App"
      description="Mobile-first navigation example"
      showBackButton={false}
    />
  )
}

export default MobileNavigationDemo 