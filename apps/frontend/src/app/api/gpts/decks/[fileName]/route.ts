
import { NextRequest, NextResponse } from 'next/server';
import { DeckService } from '@/shared/lib/deck-service';

const getApiKey = (req: NextRequest) => {
  return req.headers.get('X-API-Key');
};

const API_KEY = process.env.GPT_API_KEY;

// GET /api/gpts/decks/[fileName] - Get a specific deck
export async function GET(
  request: NextRequest,
  { params }: { params: { fileName: string } }
) {
  if (getApiKey(request) !== API_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const { fileName } = params;
    const deck = await DeckService.loadDeck(fileName);
    
    if (!deck) {
      return NextResponse.json(
        { success: false, error: 'Deck not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      data: { fileName, deck }
    });

  } catch (error) {
    console.error('Error fetching deck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deck' },
      { status: 500 }
    );
  }
}
