import { NextRequest, NextResponse } from 'next/server';
import { deckStore } from '@/lib/deck-store';
import { DeckSchema } from '@/shared/schemas/deck';
import { v4 as uuidv4 } from 'uuid';
import { deckCache } from '@/lib/redis-client';

// GET /api/decks - List all decks
export async function GET() {
  try {
    // Try Redis cache first
    const cachedDecks = await deckCache.getAll();
    if (cachedDecks) {
      return NextResponse.json({ success: true, data: cachedDecks });
    }

    // Fallback to local store and cache the result
    const decks = await deckStore.getAll();
    await deckCache.setAll(decks);
    return NextResponse.json({ success: true, data: decks });
  } catch (error) {
    console.error('Error fetching decks:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch decks' },
      { status: 500 }
    );
  }
}

// POST /api/decks - Create a new deck
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const validatedDeck = DeckSchema.parse({
      ...body,
      id: body.id || uuidv4(),
    });

    const fileName = validatedDeck.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Check if deck already exists in cache first
    const existingDeck = await deckCache.getOne(fileName);
    if (existingDeck) {
      return NextResponse.json(
        { success: false, error: 'A deck with this name already exists' },
        { status: 409 }
      );
    }

    // Create deck in local store
    const newDeck = await deckStore.create(fileName, validatedDeck);

    // Update cache with all decks
    const allDecks = await deckStore.getAll();
    await deckCache.setAll(allDecks);

    return NextResponse.json({
      success: true,
      data: newDeck,
      message: 'Deck created successfully'
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: `Failed to create deck: ${errorMessage}` },
      { status: 500 }
    );
  }
}