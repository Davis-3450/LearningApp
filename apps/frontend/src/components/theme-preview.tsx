'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import type { AvailableTheme } from './theme-provider'

interface ThemePreviewProps {
  theme: AvailableTheme
  onSelect?: (theme: AvailableTheme) => void
}

export default function ThemePreview({ theme, onSelect }: ThemePreviewProps) {
  return (
    <Card
      onClick={() => onSelect?.(theme)}
      className={cn('cursor-pointer w-40', theme)}
    >
      <CardHeader>
        <CardTitle className="capitalize text-sm">{theme}</CardTitle>
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
