import { z } from "zod";
import { ConceptSchema } from "./concepts";

// Schema version – bump when we introduce breaking changes so tooling can
// perform migrations if necessary.
export const DECK_SCHEMA_VERSION = 1 as const;

export const DeckSchema = z.object({
  id: z.string().uuid(),
  title: z.string().min(1, "Title cannot be empty."),
  description: z.string().optional(),
  concepts: z.array(ConceptSchema).min(1, "A deck must have at least one concept."),
  version: z.number().optional().default(DECK_SCHEMA_VERSION),
}).passthrough();

export type Deck = z.infer<typeof DeckSchema>; 