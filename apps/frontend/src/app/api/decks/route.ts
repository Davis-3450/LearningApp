import { NextRequest, NextResponse } from 'next/server';
import { deckStore } from '@/lib/deck-store';
import { DeckSchema } from '@/shared/schemas/deck';
import { v4 as uuidv4 } from 'uuid';

// GET /api/decks - List all decks
export async function GET() {
  try {
    const decks = deckStore.getAll();
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

    const newDeck = deckStore.create(fileName, validatedDeck);

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