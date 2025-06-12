import type { Deck } from '../schemas/deck';
import type { Flashcard } from '../schemas/cards';

/**
 * Generates a list of flashcards from a deck's concepts.
 * Each term concept yields two cards: term -> definition and definition -> term.
 */
export function generateFlashcards(deck: Deck): Flashcard[] {
  const flashcards: Flashcard[] = [];

  for (const concept of deck.concepts) {
    if (concept.conceptType === 'term') {
      // Standard card (term -> definition)
      flashcards.push({
        cardType: 'flashcard',
        data: {
          front: concept.term,
          back: concept.definition,
        },
      });

      // Reverse card (definition -> term)
      flashcards.push({
        cardType: 'flashcard',
        data: {
          front: concept.definition,
          back: concept.term,
        },
      });
    }
  }

  return flashcards;
}
