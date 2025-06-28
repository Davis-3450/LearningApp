import { NextRequest, NextResponse } from 'next/server';
import { DeckService } from '@/shared/lib/deck-service';
import { DeckSchema } from '@/shared/schemas/deck';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@/lib/logger';

// GET /api/decks/[fileName] - Get a specific deck
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ fileName: string }> }
) {
  try {
    const { fileName } = await params;
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
    logger.error('Error fetching deck:', error);
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
    
    // Validate the deck data
    const validatedDeck = DeckSchema.parse(body);    // Write the updated deck to file
    const deckDirectory = path.join(process.cwd(), '../../shared/data/decks');
    const filePath = path.join(deckDirectory, `${fileName}.json`);
    
    await fs.writeFile(filePath, JSON.stringify(validatedDeck, null, 2), 'utf8');

    return NextResponse.json({
      success: true,
      data: { fileName, deck: validatedDeck },
      message: 'Deck updated successfully'
    });

  } catch (error) {
    logger.error('Error updating deck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update deck' },
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
      const deckDirectory = path.join(process.cwd(), '../../shared/data/decks');
    const filePath = path.join(deckDirectory, `${fileName}.json`);
    
    // Check if file exists
    try {
      await fs.access(filePath);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Deck not found' },
        { status: 404 }
      );
    }

    // Delete the file
    await fs.unlink(filePath);

    return NextResponse.json({
      success: true,
      message: 'Deck deleted successfully'
    });

  } catch (error) {
    logger.error('Error deleting deck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete deck' },
      { status: 500 }
    );
  }
} 