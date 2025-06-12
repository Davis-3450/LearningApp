import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { NextRequest } from 'next/server';
import { POST as createDeck } from '../src/app/api/decks/route';
import { GET as listDecks } from '../src/app/api/decks/route';
import { GET as getDeck, PUT as updateDeck, DELETE as deleteDeck } from '../src/app/api/decks/[fileName]/route';
import fs from 'fs/promises';
import path from 'path';

const deckDir = path.join(process.cwd(), '../../shared/data/decks');
const testTitle = 'Test Deck CRUD';
const fileName = testTitle.toLowerCase().replace(/[^a-z0-9\s-]/g, '').replace(/\s+/g, '-').trim();

const newDeck = {
  title: testTitle,
  description: 'testing crud',
  concepts: [
    { conceptType: 'term', term: 'Hola', definition: 'Hello', variations: [] }
  ]
};

beforeAll(async () => {
  // ensure deck does not exist
  await fs.rm(path.join(deckDir, `${fileName}.json`), { force: true });
});

afterAll(async () => {
  await fs.rm(path.join(deckDir, `${fileName}.json`), { force: true });
});

describe('Deck API CRUD', () => {
  it('creates, reads, updates and deletes a deck', async () => {
    // CREATE
    const createReq = new NextRequest('http://localhost/api/decks', {
      method: 'POST',
      body: JSON.stringify(newDeck),
      headers: { 'Content-Type': 'application/json' }
    });
    const createRes = await createDeck(createReq);
    const createJson = await createRes.json();
    expect(createJson.success).toBe(true);
    expect(createJson.data.fileName).toBe(fileName);

    // LIST
    const listRes = await listDecks();
    const listJson = await listRes.json();
    const found = listJson.data.find((d: any) => d.fileName === fileName);
    expect(found).toBeTruthy();

    // GET
    const getRes = await getDeck(undefined as any, { params: Promise.resolve({ fileName }) });
    const getJson = await getRes.json();
    expect(getJson.data.deck.title).toBe(testTitle);

    // UPDATE
    const updatedDeck = { ...getJson.data.deck, description: 'updated' };
    const updateReq = new NextRequest('http://localhost/api/decks/'+fileName, {
      method: 'PUT',
      body: JSON.stringify(updatedDeck),
      headers: { 'Content-Type': 'application/json' }
    });
    const updateRes = await updateDeck(updateReq, { params: Promise.resolve({ fileName }) });
    const updateJson = await updateRes.json();
    expect(updateJson.success).toBe(true);

    // DELETE
    const deleteRes = await deleteDeck(undefined as any, { params: Promise.resolve({ fileName }) });
    const deleteJson = await deleteRes.json();
    expect(deleteJson.success).toBe(true);
  });
});
