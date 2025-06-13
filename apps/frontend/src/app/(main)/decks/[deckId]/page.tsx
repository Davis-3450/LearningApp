'use client';

import { DeckViewDialog } from '@/components/dialogs/deck-view-dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define types based on your data structure
// Ensure these are consistent with types elsewhere
interface Concept {
  id: string;
  term: string;
  definition: string;
  variations?: Array<{ type: string; text: string }>;
  conceptType?: string;
}

interface Deck {
  id: string;
  title: string;
  description?: string;
  concepts: Concept[];
}

export default function DeckPage({ params }: { params: { deckId: string } }) {
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(true); // For controlling dialog on this page

  useEffect(() => {
    if (params.deckId) {
      setLoading(true);
      fetch(`/api/decks/${params.deckId}`)
        .then(async (res) => {
          if (!res.ok) {
            const errorData = await res.json().catch(() => ({ error: 'Failed to parse error response' }));
            throw new Error(errorData.error || `Error: ${res.status}`);
          }
          return res.json();
        })
        .then((data: Deck) => {
          setDeck(data);
          setError(null);
        })
        .catch((err) => {
          console.error("Failed to fetch deck:", err);
          setError(err.message);
          setDeck(null);
        })
        .finally(() => {
          setLoading(false);
        });
    }
  }, [params.deckId]);

  const handleDialogClose = () => {
    setIsDialogOpen(false);
    router.push('/'); // Navigate to home or another appropriate page when dialog is closed
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Loading deck...</p> {/* Replace with a proper loading spinner/component */}
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-screen">
        <p className="text-red-500">Error loading deck: {error}</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go Home
        </button>
      </div>
    );
  }

  if (!deck) {
     // This case might be hit if error is null but deck is still null (e.g. API returns empty for some reason)
    return (
      <div className="flex justify-center items-center min-h-screen">
        <p>Deck not found.</p>
        <button onClick={() => router.push('/')} className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
          Go Home
        </button>
      </div>
    );
  }

  // When accessed directly, render DeckViewDialog as part of the page
  return <DeckViewDialog open={isDialogOpen} onOpenChange={handleDialogClose} deck={deck} />;
}
