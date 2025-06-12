import { z } from 'zod';

export const FlashcardSchema = z.object({
  id: z.string(),
  data: z.object({
    front: z.string(),
    back: z.string(),
  }),
});

export type Flashcard = z.infer<typeof FlashcardSchema>;
