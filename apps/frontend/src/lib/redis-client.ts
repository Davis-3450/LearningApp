import { Redis } from "@upstash/redis";
import type { Deck } from "@/shared/schemas/deck";
import { DeckService } from "@/shared/lib/deck-service";

// Check if Redis credentials are available
const hasRedisCredentials = !!(process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN);

// Singleton Redis instance
export const redis = hasRedisCredentials
  ? new Redis({
      url: process.env.KV_REST_API_URL as string,
      token: process.env.KV_REST_API_TOKEN as string,
    })
  : null;

const DECKS_KEY = 'decks';

// Helper functions for deck operations using a Redis Hash
export const deckCache = {
  /**
   * Retrieves a single deck by its filename from the Redis hash.
   * Efficiently fetches only the required deck.
   */
  async getOne(fileName: string): Promise<{ fileName: string; deck: Deck } | null> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return DeckService.loadDeck(fileName).then(deck => deck ? { fileName, deck } : null);
    }
    try {
      const deckData = await redis.hget(DECKS_KEY, fileName);
      if (!deckData) return null;
      return { fileName, deck: deckData as Deck };
    } catch (error) {
      console.error(`Failed to get deck "${fileName}" from cache:`, error);
      return null;
    }
  },

  /**
   * Retrieves all decks from the Redis hash.
   */
  async getAll(): Promise<Array<{ fileName: string; deck: Deck }>> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return DeckService.getAllDecksInfo();
    }
    try {
      const decksData = await redis.hgetall(DECKS_KEY);
      if (!decksData) return [];
      
      return Object.entries(decksData).map(([fileName, deck]) => ({
        fileName,
        deck: deck as Deck,
      }));
    } catch (error) {
      console.error('Failed to get all decks from cache:', error);
      return [];
    }
  },

  /**
   * Adds or updates a single deck in the Redis hash.
   */
  async addOne(fileName: string, deck: Deck): Promise<void> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return;
    }
    try {
      await redis.hset(DECKS_KEY, { [fileName]: deck });
    } catch (error) {
      console.error(`Failed to cache deck "${fileName}":`, error);
    }
  },
  
  /**
   * Deletes a single deck from the Redis hash.
   */
  async deleteOne(fileName: string): Promise<void> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return;
    }
    try {
      await redis.hdel(DECKS_KEY, fileName);
    } catch (error) {
      console.error(`Failed to delete deck "${fileName}" from cache:`, error);
    }
  },

  /**
   * Invalidates the entire deck hash from Redis.
   */
  async invalidate(): Promise<void> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return;
    }
    try {
      await redis.del(DECKS_KEY);
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
    }
  },

  /**
   * Populates the Redis cache from the filesystem if it's empty.
   * This is intended to be called on application startup.
   */
  async syncFromFileSystem(): Promise<void> {
    if (!redis) {
      console.warn('Redis not configured, skipping initial sync.');
      return;
    }

    try {
      const deckCount = await redis.hlen(DECKS_KEY);
      if (deckCount > 0) {
        console.log('Deck cache is already populated, skipping sync.');
        return;
      }

      console.log('Deck cache is empty, populating from filesystem...');
      const fileDecks = await DeckService.getAllDecksInfo();
      if (fileDecks.length === 0) {
        console.log('No decks found on filesystem to sync.');
        return;
      }
      
      // Use multiple HSET commands for better reliability in serverless
      for (const { fileName, deck } of fileDecks) {
        await redis.hset(DECKS_KEY, { [fileName]: deck });
      }

      console.log(`Successfully synced ${fileDecks.length} decks to Redis.`);
    } catch (error) {
      console.error('Failed to sync decks from filesystem to Redis:', error);
      // Still try to continue operation without cache
    }
  }
}; 