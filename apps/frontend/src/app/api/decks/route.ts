import { NextRequest, NextResponse } from 'next/server';
import { DeckService } from '@/shared/lib/deck-service';
import { DeckSchema } from '@/shared/schemas/deck';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// GET /api/decks - List all decks
export async function GET() {
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

// POST /api/decks - Create a new deck
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate the deck data
    const validatedDeck = DeckSchema.parse({
      ...body,
      id: body.id || uuidv4(), // Generate UUID if not provided
    });

    // Create a safe filename from the title
    const fileName = validatedDeck.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '') // Remove special characters
      .replace(/\s+/g, '-') // Replace spaces with hyphens
      .trim();

    // Check if file already exists
    const deckDirectory = path.join(process.cwd(), '..', '..', 'shared', 'data', 'decks');
    const filePath = path.join(deckDirectory, `${fileName}.json`);
    
    try {
      await fs.access(filePath);
      return NextResponse.json(
        { success: false, error: 'A deck with this name already exists' },
        { status: 409 }
      );
    } catch {
      // File doesn't exist, which is what we want
    }

    // Write the deck to file
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