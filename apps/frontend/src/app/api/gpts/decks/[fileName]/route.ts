import { NextRequest, NextResponse } from 'next/server';
import { DeckService } from '@/shared/lib/deck-service';
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

// GET /api/gpts/decks/[fileName] - Get a specific deck
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  if (getApiKey(request) !== API_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { fileName } = await params;

    // Try Redis cache first
    const cachedDeck = await deckCache.getOne(fileName);
    if (cachedDeck) {
      return NextResponse.json({ success: true, data: cachedDeck });
    }

    // Fallback to filesystem
    const deck = await DeckService.loadDeck(fileName);
    
    if (!deck) {
      return NextResponse.json(
        { success: false, error: 'Deck not found' },
        { status: 404 }
      );
    }

    const deckData = { fileName, deck };
    
    // Cache the result for future requests
    const allDecks = await deckCache.getAll() || [];
    const updatedDecks = [...allDecks.filter(d => d.fileName !== fileName), deckData];
    await deckCache.setAll(updatedDecks);

    return NextResponse.json({
      success: true,
      data: deckData
    });

  } catch (error) {
    console.error('Error fetching deck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deck' },
      { status: 500 }
    );
  }
}
