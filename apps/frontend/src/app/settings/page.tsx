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
import { tones, colorAttenuations, attenuationColors, type Tone, type ColorAttenuation } from '@/components/theme-provider'
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
  CheckCircle,
  Sun,
  Moon,
  Sunset
} from 'lucide-react'
import { PageContent } from '@/components/ui/page-layout'

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [mounted, setMounted] = useState(false)
  const [currentTone, setCurrentTone] = useState<Tone>('light')
  const [currentAttenuation, setCurrentAttenuation] = useState<ColorAttenuation>('default')
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

    // Parse current theme to extract tone and attenuation
    if (theme && theme !== 'system') {
      const parts = theme.split('-')
      if (parts.length === 1) {
        // Simple tone like 'light', 'dark'
        setCurrentTone(parts[0] as Tone)
        setCurrentAttenuation('default')
      } else {
        // Combined theme like 'light-rose', 'dark-ocean'
        setCurrentTone(parts[0] as Tone)
        setCurrentAttenuation(parts[1] as ColorAttenuation)
      }
    }
  }, [theme])

  // Apply high contrast class to document
  useEffect(() => {
    if (accessibilitySettings.highContrast) {
      document.documentElement.classList.add('high-contrast')
    } else {
      document.documentElement.classList.remove('high-contrast')
    }
  }, [accessibilitySettings.highContrast])

  const saveToLocalStorage = (key: string, value: any) => {
    localStorage.setItem(key, typeof value === 'string' ? value : JSON.stringify(value))
  }

  const updateTheme = (tone: Tone, attenuation: ColorAttenuation) => {
    const newTheme = attenuation === 'default' ? tone : `${tone}-${attenuation}`
    setTheme(newTheme)
    setCurrentTone(tone)
    setCurrentAttenuation(attenuation)
  }

  const resetAllSettings = () => {
    if (confirm('Are you sure you want to reset all settings to default? This action cannot be undone.')) {
      localStorage.removeItem('fontSize')
      localStorage.removeItem('studySettings')
      localStorage.removeItem('accessibilitySettings')
      setTheme('system')
      setCurrentTone('light')
      setCurrentAttenuation('default')
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

  const getToneIcon = (tone: Tone) => {
    switch (tone) {
      case 'light': return <Sun className="h-4 w-4" />
      case 'dim': return <Sunset className="h-4 w-4" />
      case 'dark': return <Moon className="h-4 w-4" />
      default: return <Monitor className="h-4 w-4" />
    }
  }

  if (!mounted) return null

  // Theme Settings Content
  const ThemeContent = () => (
    <div className="pb-20">
      <PageContent>
        {/* Tone Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Tone
            </CardTitle>
            <CardDescription>
              Choose the brightness level for your interface
            </CardDescription>
            {currentTone && (
              <Badge variant="outline" className="w-fit">
                Current: {currentTone}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 gap-3">
              {tones.map((tone) => (
                <Button
                  key={tone}
                  variant={currentTone === tone ? "default" : "outline"}
                  className="flex items-center gap-2 h-12"
                  onClick={() => updateTheme(tone, currentAttenuation)}
                >
                  {getToneIcon(tone)}
                  <span className="capitalize">{tone}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Color Attenuation Selection */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Palette className="h-5 w-5" />
              Color Theme
            </CardTitle>
            <CardDescription>
              Choose your preferred color scheme
            </CardDescription>
            {currentAttenuation && (
              <Badge variant="outline" className="w-fit">
                Current: {currentAttenuation}
              </Badge>
            )}
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-3 sm:grid-cols-4 lg:grid-cols-6 gap-3">
              {colorAttenuations.map((attenuation) => (
                <Button
                  key={attenuation}
                  variant={currentAttenuation === attenuation ? "default" : "outline"}
                  className="flex items-center gap-2 h-12"
                  onClick={() => updateTheme(currentTone, attenuation)}
                >
                  <span
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: attenuationColors[attenuation] }}
                  />
                  <span className="capitalize">{attenuation}</span>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Combined Theme Preview */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Theme Preview
            </CardTitle>
            <CardDescription>
              Preview of your current theme combination: {currentTone} + {currentAttenuation}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 gap-3">
              <ThemePreview
                theme={currentAttenuation === 'default' ? currentTone : `${currentTone}-${currentAttenuation}`}
                isActive={true}
                onSelect={() => {}}
              />
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
      </PageContent>
    </div>
  )

  // Study Settings Content
  const StudyContent = () => (
    <div className="pb-20">
      <PageContent>
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
                <SelectItem value="flashcard">Flashcards</SelectItem>
                <SelectItem value="quiz">Quiz</SelectItem>
                <SelectItem value="matching">Matching Game</SelectItem>
                <SelectItem value="sequence">Sequence</SelectItem>
              </SelectContent>
            </Select>
          </CardContent>
        </Card>

        {/* Auto Advance Settings */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Timer className="h-5 w-5" />
              Auto Advance
            </CardTitle>
            <CardDescription>
              Automatically move to the next card after a delay
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Enable auto-advance</span>
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
                  <span>Delay: {studySettings.autoAdvanceDelay[0]} seconds</span>
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
                  step={0.5}
                  className="w-full"
                />
              </div>
            )}
          </CardContent>
        </Card>

        {/* Study Preferences */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Study Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="font-medium">Show hints</span>
              <Button
                variant={studySettings.showHints ? "default" : "outline"}
                size="sm"
                onClick={() => {
                  const newSettings = { ...studySettings, showHints: !studySettings.showHints }
                  setStudySettings(newSettings)
                  saveToLocalStorage('studySettings', newSettings)
                }}
              >
                {studySettings.showHints ? "On" : "Off"}
              </Button>
            </div>
            
            <div>
              <label className="text-sm font-medium mb-2 block">Default difficulty level</label>
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
                  <SelectItem value="beginner">Beginner</SelectItem>
                  <SelectItem value="intermediate">Intermediate</SelectItem>
                  <SelectItem value="advanced">Advanced</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </div>
  )

  // Accessibility Settings Content
  const AccessibilityContent = () => (
    <div className="pb-20">
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Visual Accessibility
            </CardTitle>
            <CardDescription>
              Settings to improve visual accessibility
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <span className="font-medium">Reduced motion</span>
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
                <span className="font-medium">High contrast</span>
                <p className="text-sm text-muted-foreground">Increase color contrast for better visibility</p>
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
                <span className="font-medium">Large text</span>
                <p className="text-sm text-muted-foreground">Use larger text sizes throughout the app</p>
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
      </PageContent>
    </div>
  )

  // About Content
  const AboutContent = () => (
    <div className="pb-20">
      <PageContent>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Info className="h-5 w-5" />
              About Learning App
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-semibold mb-2">Version</h3>
              <p className="text-sm text-muted-foreground">1.0.0</p>
            </div>
            
            <div>
              <h3 className="font-semibold mb-2">Description</h3>
              <p className="text-sm text-muted-foreground">
                A powerful learning app that helps you create and study custom decks using flashcards, 
                quizzes, and other interactive learning methods.
              </p>
            </div>

            <div>
              <h3 className="font-semibold mb-2">Features</h3>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Create custom learning decks</li>
                <li>• Multiple study modes (flashcards, quizzes, matching)</li>
                <li>• AI-powered deck generation</li>
                <li>• Progress tracking</li>
                <li>• Customizable themes</li>
              </ul>
            </div>
            
            <div className="pt-4 border-t">
              <Button variant="outline" onClick={resetAllSettings} className="w-full">
                <RotateCcw className="mr-2 h-4 w-4" />
                Reset All Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </div>
  )

  const navigationItems: NavigationItem[] = [
    {
      id: 'theme',
      label: 'Theme',
      shortLabel: 'Theme',
      icon: Palette,
      content: <ThemeContent />
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
        defaultValue="theme"
        variant="top"
        title="Settings"
        description="Customize your learning experience"
      />
    </div>
  )
}
