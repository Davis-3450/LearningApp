import type { Deck } from "../schemas/deck";
import type { Concept } from "../schemas/concepts";
import type { Flashcard } from "../schemas/cards";

/**
 * Generates a list of flashcards from a deck's concepts.
 * 
 * @param deck The deck containing the concepts.
 * @returns An array of flashcards.
 */
export function generateFlashcards(deck: Deck): Flashcard[] {
  const flashcards: Flashcard[] = [];

  for (const concept of deck.concepts) {
    if (concept.conceptType === "term") {
      // Create a standard flashcard (term -> definition)
      flashcards.push({
        cardType: "flashcard",
        data: {
          front: concept.term,
          back: concept.definition,
        },
      });

      // Create a reverse flashcard (definition -> term)
      flashcards.push({
        cardType: "flashcard",
        data: {
          front: concept.definition,
          back: concept.term,
        },
      });
    }
    // In the future, other concept types could also generate flashcards
  }

  return flashcards;
} 