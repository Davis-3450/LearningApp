import { NextRequest, NextResponse } from 'next/server';
import { deckStore } from '@/lib/deck-store';
import { DeckSchema } from '@/shared/schemas/deck';

// GET /api/decks/[fileName] - Get a specific deck
export async function GET(
  request: NextRequest,
  { params }: { params: { fileName: string } }
) {
  try {
    const { fileName } = params;
    const deckData = deckStore.getOne(fileName);
    
    if (!deckData) {
      return NextResponse.json(
        { success: false, error: 'Deck not found' },
        { status: 404 }
      );
    }

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

// PUT /api/decks/[fileName] - Update a specific deck
export async function PUT(
  request: NextRequest,
  { params }: { params: { fileName: string } }
) {
  try {
    const { fileName } = params;
    const body = await request.json();
    const validatedDeck = DeckSchema.parse(body);
    
    const updatedDeck = deckStore.update(fileName, validatedDeck);

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
  { params }: { params: { fileName: string } }
) {
  try {
    const { fileName } = params;
    deckStore.delete(fileName);

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