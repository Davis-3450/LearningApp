<<<<<<< HEAD
<<<<<<< HEAD
import { z } from "zod";

// ---------------------------------------------------------------------------
//  Variation helpers – keep UI and validation logic DRY
// ---------------------------------------------------------------------------

/**
 * The set of variation categories that our UI explicitly supports.  
 * Validation purposely allows any string to future-proof the schema, so these
 * values are mainly used for dropdowns / styling.
 */
export const VARIATION_TYPES = [
  "alternative-definition",
  "example",
  "fun-fact",
  "misconception",
  "tip",
  "explanation",
  "historical-note",
] as const;

type VariationType = (typeof VARIATION_TYPES)[number];

/**
 * A single variation of a concept (e.g. example, tip…).  
 * We accept ANY string for `type` to make the schema forward-compatible, while
 * the UI still references `VARIATION_TYPES` so we have a curated list.
 */
export const VariationSchema = z
  .object({
    type: z.string().min(1),
    text: z.string().min(1),
  })
  .passthrough();

export type Variation = z.infer<typeof VariationSchema> & { type: VariationType };

/**
 * Represents a single piece of knowledge, like a term and its definition.
 * It can include variations to be used for generating different kinds of questions.
 */
export const TermConceptSchema = z.object({
  conceptType: z.literal("term"),
  term: z.string().min(1),
  definition: z.string().min(1),
  // Optional variations for more diverse questions
  variations: z.array(VariationSchema).optional(),
}).passthrough(); // allow extra keys for future-proofing

export type TermConcept = z.infer<typeof TermConceptSchema>;

// We will add more concept types here later (e.g., SequenceConcept, RelationConcept)

// A discriminated union of all concept types.
export const ConceptSchema = z.discriminatedUnion("conceptType", [
  TermConceptSchema,
  // Other concept schemas will be added here
]); 
=======
=======
>>>>>>> 85b5c276ec45cbf76a8a69c7fa290c5b64704bc2
import { z } from 'zod';

export const VariationSchema = z.object({
  type: z.string(),
  text: z.string(),
});
export type Variation = z.infer<typeof VariationSchema>;

export const TermConceptSchema = z.object({
  conceptType: z.literal('term'),
  term: z.string(),
  definition: z.string(),
  variations: z.array(VariationSchema).optional(),
});
export type TermConcept = z.infer<typeof TermConceptSchema>;

export const ConceptSchema = TermConceptSchema;
export type Concept = z.infer<typeof ConceptSchema>;
<<<<<<< HEAD
>>>>>>> 85b5c276ec45cbf76a8a69c7fa290c5b64704bc2
=======
>>>>>>> 85b5c276ec45cbf76a8a69c7fa290c5b64704bc2
