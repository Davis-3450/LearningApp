'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

// Define types based on spanish-basics.json and previous interface in page.tsx
// It's good practice to have these in a shared types file eventually.
interface Concept {
  conceptType?: string; // As seen in spanish-basics, but might not be used directly
  term: string;
  definition: string;
  variations?: Array<{ type: string; text: string }>; // Optional variations
  id?: string; // If concepts have IDs, like 'conceptId'
}

interface Deck {
  id: string;
  title: string;
  description?: string;
  concepts: Concept[];
}

interface DeckViewDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  deck: Deck | null;
}

export function DeckViewDialog({ open, onOpenChange, deck }: DeckViewDialogProps) {
  if (!deck) {
    return null; // Or a loading/placeholder if preferred
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg"> {/* Increased width slightly */}
        <DialogHeader>
          <DialogTitle>{deck.title}</DialogTitle>
          {deck.description && (
            <DialogDescription>{deck.description}</DialogDescription>
          )}
        </DialogHeader>
        <div className="py-4">
          <h3 className="mb-2 text-lg font-semibold">Concepts:</h3>
          {/* Basic scrollable div as ScrollArea component is not confirmed */}
          <div style={{ maxHeight: '400px', overflowY: 'auto', border: '1px solid #e5e7eb', borderRadius: '0.375rem', padding: '1rem' }}>
            {deck.concepts && deck.concepts.length > 0 ? (
              <ul className="space-y-3">
                {deck.concepts.map((concept, index) => (
                  <li key={concept.id || index} className="p-3 bg-secondary/50 rounded-md">
                    <p className="font-semibold text-sm text-primary">{concept.term}</p>
                    <p className="text-xs text-muted-foreground">{concept.definition}</p>
                    {concept.variations && concept.variations.find(v => v.type === 'example' && v.text) && (
                        <p className="text-xs italic text-muted-foreground/80">
                            e.g., {concept.variations.find(v => v.type === 'example' && v.text)?.text}
                        </p>
                    )}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground">No concepts found in this deck.</p>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
