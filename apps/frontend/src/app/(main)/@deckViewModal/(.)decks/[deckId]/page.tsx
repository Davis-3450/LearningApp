'use client';

import { DeckViewDialog } from '@/components/dialogs/deck-view-dialog';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Define types based on your data structure
// Ensure these are consistent with types elsewhere (e.g., in DeckViewDialog itself or a shared types file)
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

export default function DeckViewModal({ params }: { params: { deckId: string } }) {
  const router = useRouter();
  const [deck, setDeck] = useState<Deck | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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

  if (loading) {
    // Optional: Render a loading state within the modal or return null
    // For a modal, often you might want it to be blank or a spinner until content is ready.
    // However, DeckViewDialog handles !deck case. For now, let's ensure dialog doesn't pop ugly.
    // Consider a small spinner placeholder if DeckViewDialog doesn't have one.
    return null; // Or a minimal loading indicator if preferred for modals
  }

  if (error) {
    // Handle error state, perhaps show a message or allow closing the modal
    // For now, also relying on DeckViewDialog's potential handling or just not showing if error.
    // A more robust solution might involve showing an error *inside* the dialog.
    console.error("Error state before rendering DeckViewDialog:", error);
    // To actually show an error message in a modal, DeckViewDialog would need an error prop.
    // For now, if an error occurs, deck will be null, and DeckViewDialog handles that.
  }

  // The DeckViewDialog itself handles the case where `deck` is null.
  return <DeckViewDialog open={true} onOpenChange={() => router.back()} deck={deck} />;
}
