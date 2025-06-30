import { NextRequest, NextResponse } from 'next/server';
import { initializeDeckStore } from '@/lib/deck-store';
import { DeckSchema } from '@/shared/schemas/deck';
import { v4 as uuidv4 } from 'uuid';
import { deckCache } from '@/lib/redis-client';
import { DeckService } from '@/shared/lib/deck-service';

// GET /api/decks - List all decks
export async function GET() {
  try {
    await initializeDeckStore();
    const decks = await deckCache.getAll();
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
    await initializeDeckStore();
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

    const existingDeck = await deckCache.getOne(fileName);
    if (existingDeck) {
      return NextResponse.json(
        { success: false, error: 'A deck with this name already exists' },
        { status: 409 }
      );
    }

    // Add to Redis cache
    await deckCache.addOne(fileName, validatedDeck);
    
    // Persist to filesystem in development to make it easier to manage decks
    if (process.env.NODE_ENV === 'development') {
        await DeckService.createDeck(fileName, validatedDeck);
    }

    return NextResponse.json({
      success: true,
      data: { fileName, deck: validatedDeck },
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