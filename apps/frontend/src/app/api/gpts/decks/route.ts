import { NextRequest, NextResponse } from 'next/server';
import { DeckService } from '@/shared/lib/deck-service';
import { DeckSchema } from '@/shared/schemas/deck';
import { deckStore } from '@/lib/deck-store';
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
    // Try Redis cache first
    const cachedDecks = await deckCache.getAll();
    if (cachedDecks) {
      return NextResponse.json({ success: true, data: cachedDecks });
    }

    // Fallback to DeckService and cache the result
    const decks = await DeckService.getAllDecksInfo();
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

// POST /api/gpts/decks - Create a new deck
export async function POST(request: NextRequest) {
  if (getApiKey(request) !== API_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
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

    // Check if deck exists in cache first
    const existingDeck = await deckCache.getOne(fileName);
    if (existingDeck) {
      return NextResponse.json(
        { success: false, error: 'A deck with this name already exists' },
        { status: 409 }
      );
    }

    // Create deck in local store
    await deckStore.create(fileName, validatedDeck);

    // Update cache with all decks
    const allDecks = await deckStore.getAll();
    await deckCache.setAll(allDecks);

    return NextResponse.json({
      success: true,
      data: { fileName, deck: validatedDeck },
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
