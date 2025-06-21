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
        'cursor-pointer w-full relative transition-colors',
        theme,
        isActive && 'ring-2 ring-primary'
      )}
    >
      <CardHeader className="p-3 pb-2">
        <CardTitle className="capitalize text-xs flex items-center gap-1">
          {theme}
          {isActive && <Check className="w-3 h-3" />}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-1 p-3 pt-0">
        <div className="h-3 rounded bg-primary" />
        <div className="h-2 rounded bg-muted" />
        <Button variant="secondary" className="w-full h-7 text-xs">
          Button
        </Button>
      </CardContent>
    </Card>
  )
}
