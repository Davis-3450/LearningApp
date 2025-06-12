import { z } from 'zod';
import { ConceptSchema } from './concepts';

export const DeckSchema = z.object({
  id: z.string(),
  title: z.string(),
  description: z.string().optional(),
  concepts: z.array(ConceptSchema),
});

export type Deck = z.infer<typeof DeckSchema>;
