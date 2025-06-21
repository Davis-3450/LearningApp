'use client'

import { useState } from 'react'
import { AppLayout, AppContent } from '@/components/ui/app-layout'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { useTheme } from 'next-themes'
import { useRouter } from 'next/navigation'
import { Palette, Settings, RotateCcw } from 'lucide-react'

export default function SimpleSettingsPage() {
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [fontSize, setFontSize] = useState('16')

  const resetSettings = () => {
    if (confirm('¿Estás seguro de que quieres resetear todas las configuraciones?')) {
      setTheme('system')
      setFontSize('16')
    }
  }

  return (
    <AppLayout 
      title="Configuración" 
      subtitle="Personaliza tu experiencia de aprendizaje"
      onBack={() => router.push('/home')}
      headerActions={
        <Button variant="outline" size="sm" onClick={resetSettings}>
          <RotateCcw className="h-4 w-4" />
        </Button>
      }
    >
      <AppContent>
        <div className="max-w-2xl mx-auto space-y-6">
          
          {/* Tema */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Palette className="h-5 w-5" />
                Tema
              </CardTitle>
              <CardDescription>
                Selecciona cómo quieres que se vea la aplicación
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={theme} onValueChange={setTheme}>
                <SelectTrigger>
                  <SelectValue placeholder="Select theme" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="light">Claro</SelectItem>
                  <SelectItem value="dark">Oscuro</SelectItem>
                  <SelectItem value="system">Sistema</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Tamaño de fuente */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="h-5 w-5" />
                Tamaño de fuente
              </CardTitle>
              <CardDescription>
                Ajusta el tamaño del texto para mejor legibilidad
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Select value={fontSize} onValueChange={setFontSize}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="14">Pequeño</SelectItem>
                  <SelectItem value="16">Normal</SelectItem>
                  <SelectItem value="18">Grande</SelectItem>
                  <SelectItem value="20">Muy grande</SelectItem>
                </SelectContent>
              </Select>
            </CardContent>
          </Card>

          {/* Ejemplo de cómo quedará en todas las páginas */}
          <Card className="border-green-200 bg-green-50 dark:bg-green-950 dark:border-green-800">
            <CardHeader>
              <CardTitle className="text-green-700 dark:text-green-300">
                ✅ Layout Consistente
              </CardTitle>
              <CardDescription className="text-green-600 dark:text-green-400">
                Todas las páginas ahora tendrán el mismo patrón:
              </CardDescription>
            </CardHeader>
            <CardContent className="text-green-600 dark:text-green-400 space-y-2">
              <div>• ← Botón de regresar automático</div>
              <div>• Título y subtítulo consistentes</div>
              <div>• Área de contenido con scroll</div>
              <div>• Navegación inferior siempre visible</div>
            </CardContent>
          </Card>

          {/* Botones de ejemplo */}
          <div className="flex gap-4">
            <Button 
              variant="outline" 
              onClick={() => router.push('/decks')}
            >
              Ir a Decks
            </Button>
            <Button 
              variant="outline" 
              onClick={() => router.push('/demo-layout')}
            >
              Ver Demo
            </Button>
          </div>

        </div>
      </AppContent>
    </AppLayout>
  )
} 