import { NextResponse } from 'next/server';
import fs from 'fs/promises';
import path from 'path';

// Define a simple type for a deck, assuming it's consistent with your JSON structure
interface Deck {
  id: string;
  // other properties like title, description, concepts etc.
  [key: string]: any; // Allow other properties
}

export async function GET(
  request: Request, // First parameter is Request object
  { params }: { params: { deckId: string } } // Second parameter contains params
) {
  try {
    const { deckId } = params;

    const filePath = path.join(process.cwd(), '..', '..', 'shared', 'data', 'decks', 'spanish-basics.json');
    const fileContent = await fs.readFile(filePath, 'utf-8');
    const decks: Deck[] = JSON.parse(fileContent);

    const deck = decks.find(d => d.id === deckId);

    if (deck) {
      return NextResponse.json(deck, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
    } else {
      return NextResponse.json(
        { error: 'Deck not found', details: `No deck found with ID: ${deckId}` },
        {
          status: 404,
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );
    }
  } catch (error) {
    console.error(`Error reading deck data for ID ${params.deckId}:`, error);
    return NextResponse.json(
      { error: 'Failed to load deck data', details: error.message },
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
  }
}
