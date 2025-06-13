'use client'

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { availableThemes, themeColors } from '@/components/theme-provider'
import ThemePreview from '@/components/theme-preview'
import { Badge } from '@/components/ui/badge'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
  }, [])

  if (!mounted) return null

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8 space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">Settings</h1>
          <p className="text-gray-600 dark:text-gray-400">Customize your experience</p>
        </div>
        <Card className="max-w-sm">
          <CardHeader>
            <CardTitle>Theme</CardTitle>
            {theme && (
              <Badge variant="outline" className="mt-2 capitalize">
                Current: {theme}
              </Badge>
            )}
          </CardHeader>
          <CardContent>
            <Select value={theme} onValueChange={setTheme}>
              <SelectTrigger>
                <SelectValue placeholder="Select theme" />
              </SelectTrigger>
              <SelectContent>
                {availableThemes.map((t) => (
                  <SelectItem
                    key={t}
                    value={t}
                    className="capitalize flex items-center gap-2"
                  >
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: themeColors[t] }}
                    />
                    {t}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-4">
              {availableThemes.map((t) => (
                <ThemePreview
                  key={t}
                  theme={t}
                  isActive={t === theme}
                  onSelect={setTheme}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
