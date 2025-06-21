'use client'

import { AppLayout, AppContent } from '@/components/ui/app-layout'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Settings, Plus } from 'lucide-react'

export default function DemoLayoutPage() {
  return (
    <AppLayout 
      title="Demo Page" 
      subtitle="This shows how the centralized layout works"
      headerActions={
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4" />
        </Button>
      }
    >
      <AppContent>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Centralized Layout Features</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h3 className="font-semibold">✅ Back Button</h3>
                <p className="text-sm text-muted-foreground">
                  Automatically handles navigation back with router.back() or custom onBack
                </p>
              </div>
              <div>
                <h3 className="font-semibold">✅ Title & Subtitle</h3>
                <p className="text-sm text-muted-foreground">
                  Consistent header layout with title and optional subtitle
                </p>
              </div>
              <div>
                <h3 className="font-semibold">✅ Header Actions</h3>
                <p className="text-sm text-muted-foreground">
                  Optional space for action buttons (like the settings icon above)
                </p>
              </div>
              <div>
                <h3 className="font-semibold">✅ Content Area</h3>
                <p className="text-sm text-muted-foreground">
                  Main content area with proper spacing from header and bottom nav
                </p>
              </div>
              <div>
                <h3 className="font-semibold">✅ Bottom Navigation</h3>
                <p className="text-sm text-muted-foreground">
                  Global navigation is automatically included in the root layout
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Usage Example</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-lg text-sm overflow-x-auto">
{`<AppLayout 
  title="Page Title" 
  subtitle="Optional subtitle"
  onBack={() => router.push('/custom-route')}
  headerActions={<Button>Action</Button>}
>
  <AppContent>
    {/* Your page content */}
  </AppContent>
</AppLayout>`}
              </pre>
            </CardContent>
          </Card>
        </div>
      </AppContent>
    </AppLayout>
  )
} 