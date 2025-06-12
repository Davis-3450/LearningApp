import { describe, it, expect } from 'vitest';
import { VariationSchema, TermConceptSchema } from '../../shared/schemas/concepts';
import { DeckSchema, DECK_SCHEMA_VERSION } from '../../shared/schemas/deck';

const validVariation = { type: 'example', text: 'Hola, ¿cómo estás?' };
const validConcept = { conceptType: 'term', term: 'Hola', definition: 'Hello', variations: [validVariation] };
const validDeck = { id: 'test-id', title: 'Test Deck', description: 'desc', concepts: [validConcept] };

describe('VariationSchema', () => {
  it('accepts valid variation', () => {
    expect(VariationSchema.parse(validVariation)).toEqual(validVariation);
  });

  it('rejects invalid variation', () => {
    expect(() => VariationSchema.parse({ type: '', text: '' })).toThrow();
  });
});

describe('TermConceptSchema', () => {
  it('accepts valid concept', () => {
    expect(TermConceptSchema.parse(validConcept)).toEqual(validConcept);
  });

  it('requires term and definition', () => {
    expect(() => TermConceptSchema.parse({ conceptType: 'term', term: '', definition: '' })).toThrow();
  });
});

describe('DeckSchema', () => {
  it('accepts valid deck and sets default version', () => {
    const parsed = DeckSchema.parse({ ...validDeck });
    expect(parsed.version).toBe(DECK_SCHEMA_VERSION);
  });

  it('requires title and at least one concept', () => {
    expect(() => DeckSchema.parse({ id: '1', title: '', concepts: [] })).toThrow();
  });
});
