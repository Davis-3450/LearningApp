'use client'

import * as React from 'react'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { ArrowLeft, LucideIcon } from 'lucide-react'

export interface NavigationItem {
  id: string
  label: string
  shortLabel?: string
  icon: LucideIcon
  content: React.ReactNode
}

export interface NavigationMenuProps {
  items: NavigationItem[]
  defaultValue?: string
  variant?: 'top' | 'bottom'
  className?: string
  onBack?: () => void
  title?: string
  description?: string
  showBackButton?: boolean
}

export function NavigationMenu({
  items,
  defaultValue,
  variant = 'top',
  className,
  onBack,
  title,
  description,
  showBackButton = false,
}: NavigationMenuProps) {
  const [activeTab, setActiveTab] = React.useState(defaultValue || items[0]?.id)
  const [previousTab, setPreviousTab] = React.useState<string | null>(null)

  const handleTabChange = (value: string) => {
    setPreviousTab(activeTab)
    setActiveTab(value)
  }

  if (variant === 'bottom') {
    return (
      <div className={cn('flex flex-col min-h-screen', className)}>
        {/* Header */}
        {(title || showBackButton) && (
          <div className="flex items-center justify-between p-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 sticky top-0 z-50">
            <div className="flex items-center gap-3">
              {showBackButton && (
                <Button variant="ghost" size="icon" onClick={onBack}>
                  <ArrowLeft className="h-4 w-4" />
                </Button>
              )}
            </div>
            {title && (
              <div className="text-right">
                <h1 className="text-xl font-semibold">{title}</h1>
                {description && (
                  <p className="text-sm text-muted-foreground">{description}</p>
                )}
              </div>
            )}
          </div>
        )}

        {/* Content Area */}
        <div className="flex-1 overflow-auto pb-20">
          <Tabs value={activeTab} onValueChange={handleTabChange}>
            {items.map((item) => (
              <TabsContent
                key={item.id}
                value={item.id}
                className={cn(
                  'data-[state=inactive]:hidden',
                  'animate-in fade-in-0 duration-300',
                  previousTab && previousTab !== item.id
                    ? 'slide-in-from-right-2'
                    : 'slide-in-from-left-2'
                )}
              >
                {item.content}
              </TabsContent>
            ))}
          </Tabs>
        </div>

        {/* Bottom Navigation */}
        <div className="fixed bottom-0 left-0 right-0 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-t shadow-lg">
          <div className="grid gap-1 p-2 max-w-md mx-auto" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
            {items.map((item) => {
              const Icon = item.icon
              const isActive = activeTab === item.id
              return (
                <Button
                  key={item.id}
                  variant="ghost"
                  size="sm"
                  onClick={() => handleTabChange(item.id)}
                  className={cn(
                    'flex flex-col gap-1 h-14 px-2 transition-all duration-200 relative',
                    isActive
                      ? 'text-primary bg-primary/10 scale-105'
                      : 'text-muted-foreground hover:text-foreground hover:bg-accent/50'
                  )}
                >
                  <Icon className={cn('h-4 w-4 transition-transform duration-200', isActive && 'scale-110')} />
                  <span className="text-xs font-medium">
                    {item.shortLabel || item.label}
                  </span>
                  {isActive && (
                    <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-8 h-1 bg-primary rounded-full animate-in slide-in-from-top-1 duration-200" />
                  )}
                </Button>
              )
            })}
          </div>
        </div>
      </div>
    )
  }

  // Top variant (default)
  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      {(title || showBackButton) && (
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {showBackButton && (
              <Button variant="ghost" size="icon" onClick={onBack} className="transition-all duration-200 hover:scale-105">
                <ArrowLeft className="h-4 w-4" />
              </Button>
            )}
          </div>
          {title && (
            <div className="text-right">
              <h1 className="text-3xl font-bold flex items-center gap-2 mb-2">
                {title}
              </h1>
              {description && (
                <p className="text-muted-foreground">{description}</p>
              )}
            </div>
          )}
        </div>
      )}

      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-6">
        <TabsList className="grid w-full h-auto" style={{ gridTemplateColumns: `repeat(${items.length}, 1fr)` }}>
          {items.map((item) => {
            const Icon = item.icon
            const isActive = activeTab === item.id
            return (
              <TabsTrigger
                key={item.id}
                value={item.id}
                className={cn(
                  'flex flex-col gap-1 h-16 px-2 transition-all duration-300 relative',
                  'data-[state=active]:bg-background dark:data-[state=active]:text-foreground',
                  'data-[state=active]:shadow-sm data-[state=active]:scale-105',
                  'hover:scale-102'
                )}
              >
                <Icon className={cn('h-4 w-4 transition-all duration-200', isActive && 'scale-110')} />
                <span className="text-xs font-medium">
                  <span className="hidden sm:inline">{item.label}</span>
                  <span className="sm:hidden">{item.shortLabel || item.label}</span>
                </span>
                {isActive && (
                  <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full transition-all duration-300 animate-in slide-in-from-bottom-1" />
                )}
              </TabsTrigger>
            )
          })}
        </TabsList>

        {items.map((item) => (
          <TabsContent
            key={item.id}
            value={item.id}
            className={cn(
              'data-[state=inactive]:hidden',
              'animate-in fade-in-0 duration-400',
              previousTab && previousTab !== item.id
                ? 'slide-in-from-right-3'
                : 'slide-in-from-left-3'
            )}
          >
            {item.content}
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}

export default NavigationMenu 