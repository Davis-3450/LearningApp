import { deckCache } from '@/lib/redis-client';
import { DeckService } from '@/shared/lib/deck-service';

let isInitialized = false;

/**
 * Ensures the data store is initialized, primarily by seeding the Redis cache
 * from the filesystem if it's empty. This function prevents multiple
 * initializations and should be called at the start of any data-accessing
 * API route.
 */
export const initializeDeckStore = async () => {
  if (isInitialized) {
    return;
  }

  // Avoid running initialization during client-side rendering or build process
  if (typeof window !== 'undefined' || process.env.npm_config_user_agent?.includes('next/build')) {
    console.log('Skipping initialization: client-side or build process');
    isInitialized = true;
    return;
  }

  console.log('Attempting to initialize deck store by syncing from filesystem...');
  
  // The sync function itself checks if Redis is configured and if it's already populated.
  await deckCache.syncFromFileSystem();
  
  isInitialized = true;
  console.log('Deck store initialization check complete.');
};

/**
 * The deckStore is now a simplified service that relies on the deckCache (Redis)
 * as the primary source of truth for runtime data. For local development
 * without Redis, it falls back to the DeckService (filesystem).
 */
export const deckStore = {
  getAll: async () => {
    await initializeDeckStore();
    return deckCache.getAll();
  },

  getOne: async (fileName: string) => {
    await initializeDeckStore();
    return deckCache.getOne(fileName);
  },

  create: async (fileName: string, deck: any) => {
    await initializeDeckStore();
    
    const existing = await deckCache.getOne(fileName);
    if (existing) {
      throw new Error('A deck with this name already exists');
    }

    // Add to cache
    await deckCache.addOne(fileName, deck);

    // Also persist to disk in development to keep git history clean
    if (process.env.NODE_ENV === 'development') {
      await DeckService.createDeck(fileName, deck);
    }
    
    return { fileName, deck };
  },

  // Note: Update and Delete operations would follow a similar pattern:
  // 1. await initializeDeckStore()
  // 2. Perform operation on deckCache
  // 3. (Optional) Perform operation on DeckService for dev persistence
};
