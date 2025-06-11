import { NextRequest, NextResponse } from 'next/server';
import { DeckSchema } from '@/shared/schemas/deck';
import { promises as fs } from 'fs';
import path from 'path';
import { v4 as uuidv4 } from 'uuid';

// POST /api/decks/import - Import deck from uploaded JSON
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File;
    
    if (!file) {
      return NextResponse.json(
        { success: false, error: 'No file provided' },
        { status: 400 }
      );
    }

    // Read file content
    const text = await file.text();
    let deckData;
    
    try {
      deckData = JSON.parse(text);
    } catch {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON file' },
        { status: 400 }
      );
    }

    // Ensure the deck has a UUID
    if (!deckData.id) {
      deckData.id = uuidv4();
    }

    // Validate the deck data
    const validatedDeck = DeckSchema.parse(deckData);

    // Create a safe filename
    const fileName = validatedDeck.title
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .trim();

    // Check if file already exists
    const deckDirectory = path.join(process.cwd(), '../../shared/data/decks');
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
      message: 'Deck imported successfully'
    });

  } catch (error) {
    console.error('Error importing deck:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to import deck' },
      { status: 500 }
    );
  }
} 