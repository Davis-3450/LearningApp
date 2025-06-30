import type { Deck } from '@/shared/schemas/deck';
import fs from 'fs';
import path from 'path';

// In-memory store for decks
let decksCache: Array<{ fileName: string; deck: Deck }> = [];
let isInitialized = false;

// Use different paths for production vs development
const getDataDirectory = () => {
  if (process.env.NODE_ENV === 'production') {
    // In production, data might be read-only, so we rely more on cache
    return path.join(process.cwd(), 'shared', 'data', 'decks');
  } else {
    // In development, use the relative path
    return path.join(process.cwd(), '../../shared', 'data', 'decks');
  }
};

const deckDirectory = getDataDirectory();

/**
 * Loads the initial decks from the filesystem into the in-memory cache.
 * This should only be called once and only in runtime, not during build.
 */
const initializeDeckStore = async () => {
  if (isInitialized) return;

  // Don't initialize during build or in client-side
  if (typeof window !== 'undefined' || process.env.NODE_ENV === 'test') {
    isInitialized = true;
    return;
  }

  try {
    // First try to load from Redis cache only if credentials are available
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN) {
      try {
        const { deckCache } = await import('@/lib/redis-client');
        const cachedDecks = await deckCache.getAll();
        if (cachedDecks && cachedDecks.length > 0) {
          decksCache = cachedDecks;
          console.log(`Initialized deck store from Redis with ${decksCache.length} decks.`);
          isInitialized = true;
          return;
        }
      } catch (redisError) {
        console.warn('Failed to load from Redis, falling back to filesystem:', redisError);
      }
    } else {
      console.log('Redis credentials not configured, using filesystem only');
    }

    // Fallback to filesystem
    try {
      if (!fs.existsSync(deckDirectory)) {
        console.warn(`Deck directory not found: ${deckDirectory}`);
        // In production, if no data directory exists, start with empty cache
        if (process.env.NODE_ENV === 'production') {
          decksCache = [];
          isInitialized = true;
          return;
        }
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
    } catch (fsError) {
      console.warn('Failed to read deck directory:', fsError);
      // In production, start with empty cache if filesystem fails
      decksCache = [];
    }

    // Sync to Redis if available and configured
    if (process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN && decksCache.length > 0) {
      try {
        const { deckCache } = await import('@/lib/redis-client');
        await deckCache.setAll(decksCache);
        console.log(`Synced ${decksCache.length} decks to Redis cache.`);
      } catch (redisError) {
        console.warn('Failed to sync to Redis:', redisError);
      }
    }

    console.log(`Initialized deck store with ${decksCache.length} decks.`);
  } catch (error) {
    console.error('Failed to initialize deck store:', error);
    // Ensure we don't crash in production
    decksCache = [];
  }
  isInitialized = true;
};

// Lazy initialization - only when needed, not on import
const ensureInitialized = async () => {
  if (!isInitialized) {
    await initializeDeckStore();
  }
};

export const deckStore = {
  getAll: async () => {
    await ensureInitialized();
    return [...decksCache];
  },

  getOne: async (fileName: string) => {
    await ensureInitialized();
    return decksCache.find(d => d.fileName === fileName) || null;
  },

  create: async (fileName: string, deck: Deck) => {
    await ensureInitialized();
    if (decksCache.find(d => d.fileName === fileName)) {
      throw new Error('A deck with this name already exists');
    }
    const newEntry = { fileName, deck };
    decksCache.push(newEntry);
    
    // Try to persist to disk if we're in a runtime environment (only in development)
    if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
      try {
        if (fs.existsSync(path.dirname(deckDirectory))) {
          if (!fs.existsSync(deckDirectory)) {
            fs.mkdirSync(deckDirectory, { recursive: true });
          }
          const filePath = path.join(deckDirectory, `${fileName}.json`);
          fs.writeFileSync(filePath, JSON.stringify(deck, null, 2), 'utf8');
        }
      } catch (writeError) {
        console.warn('Failed to persist deck to disk:', writeError);
      }
    }
    
    return newEntry;
  },

  update: async (fileName: string, deck: Deck) => {
    await ensureInitialized();
    const index = decksCache.findIndex(d => d.fileName === fileName);
    if (index === -1) {
      throw new Error('Deck not found');
    }
    const updatedEntry = { fileName, deck };
    decksCache[index] = updatedEntry;
    
    // Try to persist to disk if we're in a runtime environment (only in development)
    if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
      try {
        if (fs.existsSync(deckDirectory)) {
          const filePath = path.join(deckDirectory, `${fileName}.json`);
          fs.writeFileSync(filePath, JSON.stringify(deck, null, 2), 'utf8');
        }
      } catch (writeError) {
        console.warn('Failed to update deck on disk:', writeError);
      }
    }
    
    return updatedEntry;
  },

  delete: async (fileName: string) => {
    await ensureInitialized();
    const initialLength = decksCache.length;
    decksCache = decksCache.filter(d => d.fileName !== fileName);
    if (decksCache.length === initialLength) {
      throw new Error('Deck not found');
    }
    
    // Try to delete from disk if we're in a runtime environment (only in development)
    if (typeof window === 'undefined' && process.env.NODE_ENV !== 'production') {
      try {
        if (fs.existsSync(deckDirectory)) {
          const filePath = path.join(deckDirectory, `${fileName}.json`);
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
          }
        }
      } catch (deleteError) {
        console.warn('Failed to delete deck from disk:', deleteError);
      }
    }
    
    return true;
  },
};
