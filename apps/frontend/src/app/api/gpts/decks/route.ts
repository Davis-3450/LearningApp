import { NextRequest, NextResponse } from 'next/server';
import { DeckService } from '@/shared/lib/deck-service';
import { DeckSchema, type Deck } from '@/shared/schemas/deck';
import { initializeDeckStore } from '@/lib/deck-store';
import { v4 as uuidv4 } from 'uuid';
import { deckCache } from '@/lib/redis-client';

// Helper to extract API token from either "Authorization: Bearer <token>" or "X-API-Key" header
const getApiKey = (req: NextRequest): string | null => {
  const authHeader = req.headers.get('authorization');
  if (authHeader && authHeader.toLowerCase().startsWith('bearer ')) {
    return authHeader.slice(7).trim();
  }
  return req.headers.get('x-api-key');
};

// Environment variable holding the shared secret
const API_KEY = process.env.AGENT_SECRET;

// GET /api/gpts/decks - List all decks
export async function GET(request: NextRequest) {
  if (getApiKey(request) !== API_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
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

// POST /api/gpts/decks - Create a new deck
export async function POST(request: NextRequest) {
  if (getApiKey(request) !== API_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    await initializeDeckStore();
    const body = await request.json();
    
    // Use the schema for validation
    const validatedDeckData = DeckSchema.parse({
      ...body,
      id: body.id || uuidv4(), // Ensure an ID exists
    });

    const fileName = validatedDeckData.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Check if deck exists in cache first
    const existingDeck = await deckCache.getOne(fileName);
    if (existingDeck) {
      return NextResponse.json(
        { success: false, error: 'A deck with this name already exists' },
        { status: 409 }
      );
    }

    // Add to Redis cache
    await deckCache.addOne(fileName, validatedDeckData);

    // No need to persist to filesystem in production. It's handled by the dev workflow.

    return NextResponse.json({
      success: true,
      data: { fileName, deck: validatedDeckData },
      message: 'Deck created successfully'
    });

  } catch (error) {
    console.error('Error creating deck:', error);
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json(
      { success: false, error: `Failed to create deck: ${errorMessage}` },
      { status: 500 }
    );
  }
}
