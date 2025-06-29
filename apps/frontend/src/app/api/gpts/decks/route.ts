
import { NextRequest, NextResponse } from 'next/server';
import { DeckService } from '@/shared/lib/deck-service';
import { DeckSchema } from '@/shared/schemas/deck';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

const getApiKey = (req: NextRequest) => {
  return req.headers.get('X-API-Key');
};

const API_KEY = process.env.GPT_API_KEY;

// GET /api/gpts/decks - List all decks
export async function GET(request: NextRequest) {
  if (getApiKey(request) !== API_KEY) {
    return NextResponse.json({ success: false, error: 'Unauthorized' }, { status: 401 });
  }
  try {
    const decks = await DeckService.getAllDecksInfo();
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

    const deckDirectory = path.join(process.cwd(), '../../shared/data/decks');
    const filePath = path.join(deckDirectory, `${fileName}.json`);

    if (fs.existsSync(filePath)) {
        return NextResponse.json(
            { success: false, error: 'A deck with this name already exists' },
            { status: 409 }
        );
    }

    await fs.writeFile(filePath, JSON.stringify(validatedDeck, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      data: { fileName, deck: validatedDeck },
      message: 'Deck created successfully'
    });

  } catch (error) {
    console.error('Error creating deck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create deck' },
      { status: 500 }
    );
  }
}
