'use client'

import { usePathname, useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Home, Search, Settings, FolderOpen, Share2 } from 'lucide-react'

const navigationItems = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
    path: '/home'
  },
  {
    id: 'decks',
    label: 'Decks',
    icon: FolderOpen,
    path: '/decks'
  },
  {
    id: 'share',
    label: 'Share',
    icon: Share2,
    path: '/share'
  },
  {
    id: 'fyp',
    label: 'FYP',
    icon: Search,
    path: '/fyp'
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings'
  }
]

export function GlobalNavigation() {
  const pathname = usePathname()
  const router = useRouter()

  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t shadow-lg z-50">
      <div className="grid grid-cols-5 gap-1 p-2 max-w-lg mx-auto">
        {navigationItems.map((item) => {
          const Icon = item.icon
          const isActive = pathname === item.path
          return (
            <Button
              key={item.id}
              variant="ghost"
              size="sm"
              onClick={() => router.push(item.path)}
              className={cn(
                'flex flex-col gap-1 h-14 px-2 transition-all duration-200 relative',
                isActive
                  ? 'text-primary bg-primary/10 scale-105'
                  : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
              )}
            >
              <Icon className={cn('h-4 w-4 transition-transform duration-200', isActive && 'scale-110')} />
              <span className="text-xs font-medium">
                {item.label}
              </span>
              {isActive && (
                <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full animate-in slide-in-from-top-1 duration-200" />
              )}
            </Button>
          )
        })}
      </div>
    </div>
  )
} 