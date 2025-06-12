import { z } from "zod";

// This file will contain the schemas for the "playable" cards
// that are generated on-the-fly from concepts.

export const FlashcardSchema = z.object({
  cardType: z.literal("flashcard"),
  data: z.object({
    front: z.string(),
    back: z.string(),
  }),
});
export type Flashcard = z.infer<typeof FlashcardSchema>;

// We will add other generated card types here, e.g., MultipleChoice 