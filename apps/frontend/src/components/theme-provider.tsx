'use client'

import {
  ThemeProvider as NextThemeProvider,
  type ThemeProviderProps,
} from "next-themes"

export const availableThemes = ["light", "dark", "rose", "forest"] as const

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
