import Link from "next/link"

export function Sidebar() {
  return (
    <aside className="hidden md:fixed md:inset-y-0 md:z-40 md:flex md:w-64 md:flex-col md:border-r md:bg-background md:p-6">
      <span className="text-xl font-semibold mb-4">Learning App</span>
      <nav className="space-y-2">
        <Link href="/" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">Home</Link>
        <Link href="/decks" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">Decks</Link>
        <Link href="/decks/create" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">Create Deck</Link>
        <Link href="/decks/ai-generate" className="block rounded-md px-3 py-2 hover:bg-accent hover:text-accent-foreground">Generate with AI</Link>
      </nav>
    </aside>
  )
}
