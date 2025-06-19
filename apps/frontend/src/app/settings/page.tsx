'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Slider } from '@/components/ui/slider'
import { NavigationMenu, NavigationItem } from '@/components/ui/navigation-menu'
import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { availableThemes, themeColors } from '@/components/theme-provider'
import ThemePreview from '@/components/theme-preview'
import { 
  Palette, 
  Settings as SettingsIcon, 
  Accessibility, 
  Info, 
  Monitor, 
  Type, 
  Zap,
  BookOpen,
  RotateCcw,
  Eye,
  Timer,
  Target,
  CheckCircle
} from 'lucide-react'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [fontSize, setFontSize] = useState([16])
  const [studySettings, setStudySettings] = useState({
    defaultGameType: 'flashcard',
    autoAdvance: true,
    autoAdvanceDelay: [3],
    showHints: true,
    difficultyLevel: 'medium'
  })
  const [accessibilitySettings, setAccessibilitySettings] = useState({
    reducedMotion: false,
    highContrast: false,
    largeText: false
  })

  useEffect(() => {
    setMounted(true)
    // Load saved settings from localStorage
    const savedFontSize = localStorage.getItem('fontSize')
    const savedStudySettings = localStorage.getItem('studySettings')
    const savedAccessibilitySettings = localStorage.getItem('accessibilitySettings')
    
    if (savedFontSize) setFontSize([parseInt(savedFontSize)])
    if (savedStudySettings) setStudySettings(JSON.parse(savedStudySettings))
    if (savedAccessibilitySettings) setAccessibilitySettings(JSON.parse(savedAccessibilitySettings))
  }, [])

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  }

  const resetAllSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      localStorage.removeItem('fontSize')
      localStorage.removeItem('studySettings')
      localStorage.removeItem('accessibilitySettings')
      setTheme('system')
      setFontSize([16])
      setStudySettings({
        defaultGameType: 'flashcard',
        autoAdvance: true,
        autoAdvanceDelay: [3],
        showHints: true,
        difficultyLevel: 'medium'
      })
      setAccessibilitySettings({
        reducedMotion: false,
        highContrast: false,
        largeText: false
      })
    }
  }

  if (!mounted) return null

  // Appearance Settings Content
  const AppearanceContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      {/* Theme Selection */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Monitor className="h-5 w-5" />
            Theme
          </CardTitle>
          <CardDescription>
            Choose your preferred color scheme
          </CardDescription>
          {theme && (
            <Badge variant="outline" className="w-fit">
              Current: {theme}
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-4">
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
          
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
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

      {/* Font Size */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Type className="h-5 w-5" />
            Font Size
          </CardTitle>
          <CardDescription>
            Adjust text size for better readability
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Size: {fontSize[0]}px</span>
              <span className="text-muted-foreground">12px - 24px</span>
            </div>
            <Slider
              value={fontSize}
              onValueChange={(value) => {
                setFontSize(value)
                saveToLocalStorage('fontSize', value[0])
              }}
              max={24}
              min={12}
              step={1}
              className="w-full"
            />
          </div>
          <div className="p-4 border rounded-md" style={{ fontSize: `${fontSize[0]}px` }}>
            <p>Sample text at {fontSize[0]}px font size</p>
            <p className="text-sm text-muted-foreground">
              This is how your text will appear
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // Study Settings Content
  const StudyContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      {/* Default Game Type */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Default Study Mode
          </CardTitle>
          <CardDescription>
            Choose your preferred way to study new decks
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={studySettings.defaultGameType} 
            onValueChange={(value) => {
              const newSettings = { ...studySettings, defaultGameType: value }
              setStudySettings(newSettings)
              saveToLocalStorage('studySettings', newSettings)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="flashcard">
                <div className="flex items-center gap-2">
                  <BookOpen className="h-4 w-4" />
                  Flashcards
                </div>
              </SelectItem>
              <SelectItem value="quiz">
                <div className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4" />
                  Quiz
                </div>
              </SelectItem>
              <SelectItem value="matching">
                <div className="flex items-center gap-2">
                  <Zap className="h-4 w-4" />
                  Matching Game
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      {/* Auto-advance Settings */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Timer className="h-5 w-5" />
            Auto-advance
          </CardTitle>
          <CardDescription>
            Automatically move to the next card
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span>Enable auto-advance</span>
            <Button
              variant={studySettings.autoAdvance ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newSettings = { ...studySettings, autoAdvance: !studySettings.autoAdvance }
                setStudySettings(newSettings)
                saveToLocalStorage('studySettings', newSettings)
              }}
            >
              {studySettings.autoAdvance ? "On" : "Off"}
            </Button>
          </div>
          
          {studySettings.autoAdvance && (
            <div className="space-y-2">
              <div className="flex justify-between text-sm">
                <span>Delay: {studySettings.autoAdvanceDelay[0]}s</span>
                <span className="text-muted-foreground">1s - 10s</span>
              </div>
              <Slider
                value={studySettings.autoAdvanceDelay}
                onValueChange={(value) => {
                  const newSettings = { ...studySettings, autoAdvanceDelay: value }
                  setStudySettings(newSettings)
                  saveToLocalStorage('studySettings', newSettings)
                }}
                max={10}
                min={1}
                step={1}
                className="w-full"
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Difficulty Level */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="h-5 w-5" />
            Difficulty Level
          </CardTitle>
          <CardDescription>
            Set your preferred challenge level
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Select 
            value={studySettings.difficultyLevel} 
            onValueChange={(value) => {
              const newSettings = { ...studySettings, difficultyLevel: value }
              setStudySettings(newSettings)
              saveToLocalStorage('studySettings', newSettings)
            }}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="easy">Easy - More hints and forgiveness</SelectItem>
              <SelectItem value="medium">Medium - Balanced experience</SelectItem>
              <SelectItem value="hard">Hard - Challenge yourself</SelectItem>
            </SelectContent>
          </Select>
        </CardContent>
      </Card>
    </div>
  )

  // Accessibility Settings Content
  const AccessibilityContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Eye className="h-5 w-5" />
            Visual Accessibility
          </CardTitle>
          <CardDescription>
            Adjust visual settings for better accessibility
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Reduced Motion</span>
              <p className="text-sm text-muted-foreground">Minimize animations and transitions</p>
            </div>
            <Button
              variant={accessibilitySettings.reducedMotion ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newSettings = { ...accessibilitySettings, reducedMotion: !accessibilitySettings.reducedMotion }
                setAccessibilitySettings(newSettings)
                saveToLocalStorage('accessibilitySettings', newSettings)
              }}
            >
              {accessibilitySettings.reducedMotion ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">High Contrast</span>
              <p className="text-sm text-muted-foreground">Increase contrast for better visibility</p>
            </div>
            <Button
              variant={accessibilitySettings.highContrast ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newSettings = { ...accessibilitySettings, highContrast: !accessibilitySettings.highContrast }
                setAccessibilitySettings(newSettings)
                saveToLocalStorage('accessibilitySettings', newSettings)
              }}
            >
              {accessibilitySettings.highContrast ? "On" : "Off"}
            </Button>
          </div>

          <div className="flex items-center justify-between">
            <div>
              <span className="font-medium">Large Text</span>
              <p className="text-sm text-muted-foreground">Use larger text throughout the app</p>
            </div>
            <Button
              variant={accessibilitySettings.largeText ? "default" : "outline"}
              size="sm"
              onClick={() => {
                const newSettings = { ...accessibilitySettings, largeText: !accessibilitySettings.largeText }
                setAccessibilitySettings(newSettings)
                saveToLocalStorage('accessibilitySettings', newSettings)
              }}
            >
              {accessibilitySettings.largeText ? "On" : "Off"}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  // About Content
  const AboutContent = () => (
    <div className="container mx-auto px-4 py-6 max-w-4xl space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Info className="h-5 w-5" />
            About Learning App
          </CardTitle>
          <CardDescription>
            Information about this application
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <span className="font-medium">Version</span>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
            <div className="space-y-2">
              <span className="font-medium">Platform</span>
              <p className="text-sm text-muted-foreground">Web Application</p>
            </div>
            <div className="space-y-2">
              <span className="font-medium">Framework</span>
              <p className="text-sm text-muted-foreground">Next.js 15</p>
            </div>
            <div className="space-y-2">
              <span className="font-medium">UI Library</span>
              <p className="text-sm text-muted-foreground">Tailwind CSS + Radix UI</p>
            </div>
          </div>
          
          <div className="pt-4 border-t">
            <p className="text-sm text-muted-foreground mb-4">
              A modern learning platform for creating and studying custom flashcard decks. 
              Built with accessibility and user experience in mind.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-2">
              <Button 
                variant="destructive" 
                onClick={resetAllSettings}
                className="flex items-center gap-2"
              >
                <RotateCcw className="h-4 w-4" />
                Reset All Settings
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const navigationItems: NavigationItem[] = [
    {
      id: 'appearance',
      label: 'Appearance',
      shortLabel: 'Theme',
      icon: Palette,
      content: <AppearanceContent />
    },
    {
      id: 'study',
      label: 'Study',
      shortLabel: 'Study',
      icon: BookOpen,
      content: <StudyContent />
    },
    {
      id: 'accessibility',
      label: 'Accessibility',
      shortLabel: 'A11y',
      icon: Accessibility,
      content: <AccessibilityContent />
    },
    {
      id: 'about',
      label: 'About',
      shortLabel: 'About',
      icon: Info,
      content: <AboutContent />
    }
  ]

  return (
    <div className="min-h-screen bg-background">
      <NavigationMenu
        items={navigationItems}
        defaultValue="appearance"
        variant="bottom"
        title="Settings"
        description="Customize your learning experience"
        showBackButton={true}
        onBack={() => router.back()}
        className="h-screen"
      />
    </div>
  )
}
