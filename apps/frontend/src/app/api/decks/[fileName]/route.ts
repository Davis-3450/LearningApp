import { NextRequest, NextResponse } from 'next/server';
import { deckStore } from '@/lib/deck-store';
import { DeckSchema } from '@/shared/schemas/deck';
import { deckCache } from '@/lib/redis-client';

// GET /api/decks/[fileName] - Get a specific deck
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;

    // Try Redis cache first
    const cachedDeck = await deckCache.getOne(fileName);
    if (cachedDeck) {
      return NextResponse.json({ success: true, data: cachedDeck });
    }

    // Fallback to local store
    const deck = await deckStore.getOne(fileName);
    if (!deck) {
      return NextResponse.json(
        { success: false, error: 'Deck not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, data: deck });
  } catch (error) {
    console.error('Error fetching deck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch deck' },
      { status: 500 }
    );
  }
}

// PUT /api/decks/[fileName] - Update a specific deck
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;
    const body = await request.json();
    
    const validatedDeck = DeckSchema.parse(body);

    // Update deck in local store
    const updatedDeck = await deckStore.update(fileName, validatedDeck);

    // Update cache
    const allDecks = await deckStore.getAll();
    await deckCache.setAll(allDecks);

    return NextResponse.json({
      success: true,
      data: updatedDeck,
      message: 'Deck updated successfully'
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: `Failed to update deck: ${errorMessage}` },
      { status: 500 }
    );
  }
}

// DELETE /api/decks/[fileName] - Delete a specific deck
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;

    // Delete from local store
    await deckStore.delete(fileName);

    // Update cache
    const allDecks = await deckStore.getAll();
    await deckCache.setAll(allDecks);

    return NextResponse.json({
      success: true,
      message: 'Deck deleted successfully'
    });

  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
    return NextResponse.json(
      { success: false, error: `Failed to delete deck: ${errorMessage}` },
      { status: 500 }
    );
  }
}