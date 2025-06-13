'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AvailableTheme } from './theme-provider'

import { Check } from 'lucide-react'

interface ThemePreviewProps {
  theme: AvailableTheme
  isActive?: boolean
  onSelect?: (theme: AvailableTheme) => void
}

export default function ThemePreview({
  theme,
  isActive,
  onSelect,
}: ThemePreviewProps) {
  return (
    <Card
      onClick={() => onSelect?.(theme)}
      className={cn(
        'cursor-pointer w-40 relative transition-colors',
        theme,
        isActive && 'ring-2 ring-primary'
      )}
    >
      <CardHeader>
        <CardTitle className="capitalize text-sm flex items-center gap-1">
          {theme}
          {isActive && <Check className="w-4 h-4" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        <div className="h-4 rounded bg-primary" />
        <div className="h-3 rounded bg-muted" />
        <Button variant="secondary" className="w-full h-8">
          Button
        </Button>
      </CardContent>
    </Card>
  )
}
