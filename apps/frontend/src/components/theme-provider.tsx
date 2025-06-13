'use client'

import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps,
} from "next-themes"

export const availableThemes = [
  "light",
  "dark",
  "rose",
  "forest",
  "ocean",
  "sunset",
  "midnight",
] as const

export type AvailableTheme = (typeof availableThemes)[number]

export const themeColors: Record<AvailableTheme, string> = {
  light: "#4b5563",
  dark: "#1f2937",
  rose: "#be123c",
  forest: "#047857",
  ocean: "#0ea5e9",
  sunset: "#ea580c",
  midnight: "#0ea5e9",
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
