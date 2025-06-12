import { Deck } from '../schemas/deck';
import { Flashcard } from '../schemas/cards';

export function generateFlashcards(deck: Deck): Flashcard[] {
  return deck.concepts.map(concept => ({
    cardType: 'flashcard',
    data: {
      front: concept.term,
      back: concept.definition
    }
  }));
}
