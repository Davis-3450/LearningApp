'use client'

import * as React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { cn } from '@/lib/utils'

interface AppLayoutProps {
  children: React.ReactNode
  title: string
  subtitle?: string
  showBackButton?: boolean
  onBack?: () => void
  headerActions?: React.ReactNode
  className?: string
}

export function AppLayout({
  children,
  title,
  subtitle,
  showBackButton = true,
  onBack,
  headerActions,
  className
}: AppLayoutProps) {
  const router = useRouter()

  const handleBack = () => {
    if (onBack) {
      onBack()
    } else {
      router.back()
    }
  }

  return (
    <div className={cn("min-h-screen bg-background", className)}>
      {/* Header */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center gap-3 flex-1">
            {showBackButton && (
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBack}
                className="h-9 w-9 p-0 hover:bg-accent/50"
              >
                <ArrowLeft className="h-4 w-4" />
                <span className="sr-only">Go back</span>
              </Button>
            )}
            <div className="flex-1 min-w-0">
              <h1 className="text-lg font-semibold truncate">{title}</h1>
              {subtitle && (
                <p className="text-sm text-muted-foreground truncate">{subtitle}</p>
              )}
            </div>
          </div>
          {headerActions && (
            <div className="flex-shrink-0 ml-3">
              {headerActions}
            </div>
          )}
        </div>
      </div>

      {/* Content */}
      <main className="pb-20">
        {children}
      </main>
    </div>
  )
}

// Content wrapper with consistent padding
export function AppContent({ 
  children, 
  className,
  noPadding = false
}: { 
  children: React.ReactNode
  className?: string
  noPadding?: boolean
}) {
  return (
    <div className={cn(!noPadding && "p-4", className)}>
      {children}
    </div>
  )
} 