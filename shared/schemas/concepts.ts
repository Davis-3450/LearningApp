import { z } from 'zod';

export const VariationSchema = z.object({
  type: z.string(),
  text: z.string()
});

export const TermConceptSchema = z.object({
  conceptType: z.literal('term'),
  term: z.string(),
  definition: z.string(),
  variations: z.array(VariationSchema).optional()
});

export type Variation = z.infer<typeof VariationSchema>;
export type TermConcept = z.infer<typeof TermConceptSchema>;
export type Concept = TermConcept; // extendable for other concept types in future
