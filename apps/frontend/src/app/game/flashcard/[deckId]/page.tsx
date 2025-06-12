import { notFound } from 'next/navigation';
import { DeckService } from '@/shared/lib/deck-service';
import { generateFlashcards } from '@/shared/lib/card-generator';
import { FlashcardPlayer } from './_components/flashcard-player';

export default async function FlashcardGamePage({ params }: { params: { deckId: string } }) {
  const { deckId } = params;
  
  // Load the deck dynamically using the filename
  const deck = await DeckService.loadDeck(deckId);

  if (!deck) {
    notFound();
    return null;
  }

  const flashcards = generateFlashcards(deck);

  return <FlashcardPlayer deck={deck} flashcards={flashcards} />;
} 