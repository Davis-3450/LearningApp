'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
// AuthDialog is no longer directly used here
// SettingsDialog is no longer directly used here
// DeckViewDialog is no longer directly used here
import { Settings as SettingsIcon } from 'lucide-react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

// Ensure Deck and Concept interfaces are consistent with DeckViewDialog and actual data
interface Concept {
  conceptType?: string;
  term: string;
  definition: string;
  variations?: Array<{ type: string; text: string }>;
  id?: string;
}

interface Deck {
  id: string;
  title: string;
  description?: string;
  concepts: Concept[];
}

export default function MainPage() {
  const [decks, setDecks] = useState<Deck[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  // isAuthDialogOpen and setIsAuthDialogOpen are removed
  // isSettingsDialogOpen and setIsSettingsDialogOpen are removed
  // selectedDeck and setIsDeckViewDialogOpen are removed
  // const [selectedDeck, setSelectedDeck] = useState<Deck | null>(null);
  // const [isDeckViewDialogOpen, setIsDeckViewDialogOpen] = useState(false);

  useEffect(() => {
    async function fetchDecks() {
      try {
        setLoading(true);
        const response = await fetch('/api/decks');
        if (!response.ok) {
          let errorMsg = `Error: ${response.status}`;
          try {
            const errorData = await response.json();
            errorMsg = errorData.error || errorMsg;
          } catch (e) {
            // Ignore if error response is not JSON
          }
          throw new Error(errorMsg);
        }
        const data = await response.json();
        // API now returns an array of decks directly
        setDecks(data as Deck[]);
      } catch (err) {
        setError(err.message || 'Failed to fetch decks');
      } finally {
        setLoading(false);
      }
    }

    fetchDecks();
  }, []);

  return (
    <div style={{ padding: '20px' }}>
      <header style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <h1>Flashcard App</h1>
        <div style={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
          <Link href="/login" scroll={false}>
            <Button>Login/Sign Up</Button>
          </Link>
          <Link href="/settings" scroll={false}>
            <Button variant="outline" size="icon">
              <SettingsIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      </header>

      <main>
        {loading && <p>Loading decks...</p>}
        {error && <p style={{ color: 'red' }}>{error}</p>}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-5"> {/* Updated container class */}
            {decks.length === 0 && <p className="col-span-full text-center">No decks found.</p>}
            {decks.map((deck) => (
              <Link key={deck.id} href={`/decks/${deck.id}`} scroll={false} passHref>
                <Card
                  className="cursor-pointer hover:shadow-lg transition-shadow duration-200 ease-in-out" // Removed fixed width, added hover effect
                  // onClick is removed, Link handles navigation
                >
                  <CardHeader>
                    <CardTitle>{deck.title}</CardTitle>
                    {deck.description && (
                      <CardDescription className="line-clamp-2">{deck.description}</CardDescription> // Added line-clamp for consistency
                    )}
                  </CardHeader>
                  <CardContent>
                    <p>Number of concepts: {deck.concepts.length}</p>
                  </CardContent>
                </Card>
              </Link>
            ))}
          </div>
        )}
      </main>
      {/* <AuthDialog open={isAuthDialogOpen} onOpenChange={setIsAuthDialogOpen} /> REMOVED */}
      {/* <SettingsDialog open={isSettingsDialogOpen} onOpenChange={setIsSettingsDialogOpen} /> REMOVED */}
      {/* <DeckViewDialog open={isDeckViewDialogOpen} onOpenChange={setIsDeckViewDialogOpen} deck={selectedDeck} /> REMOVED */}
    </div>
  );
}
