<<<<<<< HEAD
import { z } from "zod";

// This file will contain the schemas for the "playable" cards
// that are generated on-the-fly from concepts.

export const FlashcardSchema = z.object({
  cardType: z.literal("flashcard"),
=======
import { z } from 'zod';

export const FlashcardSchema = z.object({
  id: z.string(),
>>>>>>> 85b5c276ec45cbf76a8a69c7fa290c5b64704bc2
  data: z.object({
    front: z.string(),
    back: z.string(),
  }),
});
<<<<<<< HEAD
export type Flashcard = z.infer<typeof FlashcardSchema>;

// We will add other generated card types here, e.g., MultipleChoice 
=======

export type Flashcard = z.infer<typeof FlashcardSchema>;
>>>>>>> 85b5c276ec45cbf76a8a69c7fa290c5b64704bc2
