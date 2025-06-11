import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const cwd = process.cwd();
    const deckDirectory = path.join(cwd, '..', '..', 'shared', 'data', 'decks');
    
    console.log('Current working directory:', cwd);
    console.log('Looking for decks at:', deckDirectory);
    
    // Try to read the directory
    let files: string[] = [];
    let error: string | null = null;
    
    try {
      files = await fs.readdir(deckDirectory);
      console.log('Found files:', files);
    } catch (err) {
      error = `Failed to read directory: ${err}`;
      console.error(error);
    }
    
    // Also try absolute path resolution
    const absolutePath = path.resolve(deckDirectory);
    console.log('Absolute path:', absolutePath);
    
    return NextResponse.json({
      cwd,
      deckDirectory,
      absolutePath,
      files,
      error
    });
  } catch (error) {
    console.error('Debug API error:', error);
    return NextResponse.json(
      { error: `Debug error: ${error}` },
      { status: 500 }
    );
  }
} 