import { z } from 'zod';
import { TermConceptSchema } from './concepts';

export const DeckSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  concepts: z.array(TermConceptSchema)
});

export type Deck = z.infer<typeof DeckSchema>;
