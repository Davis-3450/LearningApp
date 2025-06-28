import { NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { logger } from '@/lib/logger';

export async function GET() {
  try {
    const cwd = process.cwd();
    const deckDirectory = path.join(cwd, '..', '..', 'shared', 'data', 'decks');
    
    logger.log('Current working directory:', cwd);
    logger.log('Looking for decks at:', deckDirectory);
    
    // Try to read the directory
    let files: string[] = [];
    let error: string | null = null;
    
    try {
      files = await fs.readdir(deckDirectory);
      logger.log('Found files:', files);
    } catch (err) {
      error = `Failed to read directory: ${err}`;
      logger.error(error);
    }
    
    // Also try absolute path resolution
    const absolutePath = path.resolve(deckDirectory);
    logger.log('Absolute path:', absolutePath);
    
    return NextResponse.json({
      cwd,
      deckDirectory,
      absolutePath,
      files,
      error
    });
  } catch (error) {
    logger.error('Debug API error:', error);
    return NextResponse.json(
      { error: `Debug error: ${error}` },
      { status: 500 }
    );
  }
} 