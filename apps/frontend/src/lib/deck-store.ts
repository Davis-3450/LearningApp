import type { Deck } from '@/shared/schemas/deck';
import fs from 'fs';
import path from 'path';

// In-memory store for decks
let decksCache: Array<{ fileName: string; deck: Deck }> = [];
let isInitialized = false;

const deckDirectory = path.join(process.cwd(), '../../shared', 'data', 'decks');

/**
 * Loads the initial decks from the filesystem into the in-memory cache.
 * This should only be called once and only in runtime, not during build.
 */
const initializeDeckStore = () => {
  if (isInitialized) return;

  // Don't initialize during build or in client-side
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'test') {
    isInitialized = true;
    return;
  }

  try {
    // Check if directory exists before trying to read it
    if (!fs.existsSync(deckDirectory)) {
      console.warn(`Deck directory not found: ${deckDirectory}`);
      isInitialized = true;
      return;
    }

    const fileNames = fs.readdirSync(deckDirectory);
    for (const fileName of fileNames) {
      if (fileName.endsWith('.json')) {
        try {
          const filePath = path.join(deckDirectory, fileName);
          const fileContent = fs.readFileSync(filePath, 'utf8');
          const deck = JSON.parse(fileContent) as Deck;
          decksCache.push({ fileName: fileName.replace('.json', ''), deck });
        } catch (fileError) {
          console.warn(`Failed to load deck file ${fileName}:`, fileError);
        }
      }
    }
    console.log(`Initialized deck store with ${decksCache.length} decks.`);
  } catch (error) {
    console.error('Failed to initialize deck store:', error);
    // In a real app, you might want to handle this more gracefully
  }
  isInitialized = true;
};

// Lazy initialization - only when needed, not on import
const ensureInitialized = () => {
  if (!isInitialized) {
    initializeDeckStore();
  }
};

export const deckStore = {
  getAll: () => {
    ensureInitialized();
    return [...decksCache];
  },

  getOne: (fileName: string) => {
    ensureInitialized();
    return decksCache.find(d => d.fileName === fileName) || null;
  },

  create: (fileName: string, deck: Deck) => {
    ensureInitialized();
    if (deckStore.getOne(fileName)) {
      throw new Error('A deck with this name already exists');
    }
    const newEntry = { fileName, deck };
    decksCache.push(newEntry);
    
    // Try to persist to disk if we're in a runtime environment
    if (typeof window === 'undefined' && fs.existsSync(path.dirname(deckDirectory))) {
      try {
        if (!fs.existsSync(deckDirectory)) {
          fs.mkdirSync(deckDirectory, { recursive: true });
        }
        const filePath = path.join(deckDirectory, `${fileName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(deck, null, 2), 'utf8');
      } catch (writeError) {
        console.warn('Failed to persist deck to disk:', writeError);
        // Don't throw, just warn - the deck is still in memory
      }
    }
    
    return newEntry;
  },

  update: (fileName: string, deck: Deck) => {
    ensureInitialized();
    const index = decksCache.findIndex(d => d.fileName === fileName);
    if (index === -1) {
      throw new Error('Deck not found');
    }
    const updatedEntry = { fileName, deck };
    decksCache[index] = updatedEntry;
    
    // Try to persist to disk if we're in a runtime environment
    if (typeof window === 'undefined' && fs.existsSync(deckDirectory)) {
      try {
        const filePath = path.join(deckDirectory, `${fileName}.json`);
        fs.writeFileSync(filePath, JSON.stringify(deck, null, 2), 'utf8');
      } catch (writeError) {
        console.warn('Failed to update deck on disk:', writeError);
      }
    }
    
    return updatedEntry;
  },

  delete: (fileName: string) => {
    ensureInitialized();
    const initialLength = decksCache.length;
    decksCache = decksCache.filter(d => d.fileName !== fileName);
    if (decksCache.length === initialLength) {
      throw new Error('Deck not found');
    }
    
    // Try to delete from disk if we're in a runtime environment
    if (typeof window === 'undefined' && fs.existsSync(deckDirectory)) {
      try {
        const filePath = path.join(deckDirectory, `${fileName}.json`);
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
        }
      } catch (deleteError) {
        console.warn('Failed to delete deck from disk:', deleteError);
      }
    }
    
    return true;
  },
};
