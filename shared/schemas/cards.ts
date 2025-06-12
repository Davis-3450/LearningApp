import { z } from 'zod';

// Schemas for playable cards generated from concepts

export const FlashcardSchema = z.object({
  cardType: z.literal('flashcard'),
  data: z.object({
    front: z.string(),
    back: z.string(),
  }),
});

export type Flashcard = z.infer<typeof FlashcardSchema>;

// Union type for different card kinds. Extend as new games are added.
export const CardSchema = FlashcardSchema;
export type Card = z.infer<typeof CardSchema>;
