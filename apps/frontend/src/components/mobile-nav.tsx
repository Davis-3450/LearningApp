import Link from "next/link"
import { Menu } from "lucide-react"
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet"
import { Button } from "@/components/ui/button"

export function MobileNav() {
  return (
    <div className="md:hidden bg-background border-b border-border px-4 py-3 flex items-center justify-between sticky top-0 z-40">
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Open menu</span>
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="p-0">
          <nav className="p-6 space-y-2">
            <Link href="/" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">Home</Link>
            <Link href="/decks" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">Decks</Link>
            <Link href="/decks/create" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">Create Deck</Link>
            <Link href="/decks/ai-generate" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">Generate with AI</Link>
          </nav>
        </SheetContent>
      </Sheet>
      <span className="font-semibold">Learning App</span>
      <div />
    </div>
  )
}
