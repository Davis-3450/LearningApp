'use client'

import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps,
} from "next-themes"

export const tones = [
  "light",
  "dim", 
  "dark",
] as const

export const colorAttenuations = [
  "default",
  "rose",
  "forest",
  "ocean",
  "sunset",
  "midnight",
] as const

export type Tone = (typeof tones)[number]
export type ColorAttenuation = (typeof colorAttenuations)[number]

// Generate all possible combinations
const generatedThemes = tones.flatMap(tone => 
  colorAttenuations.map(color => 
    color === "default" ? tone : `${tone}-${color}`
  )
)

export const availableThemes = generatedThemes

export type AvailableTheme = string

export const attenuationColors: Record<ColorAttenuation, string> = {
  default: "#4b5563",
  rose: "#be123c",
  forest: "#047857",
  ocean: "#0ea5e9",
  sunset: "#ea580c",
  midnight: "#38bdf8",
}

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return (
    <NextThemeProvider
      attribute="class"
      enableSystem
      defaultTheme="system"
      disableTransitionOnChange
      themes={availableThemes as unknown as string[]}
      {...props}
    >
      {children}
    </NextThemeProvider>
  )
}
