import { Redis } from "@upstash/redis";
import type { Deck } from "@/shared/schemas/deck";

// Check if Redis credentials are available
const hasRedisCredentials = process.env.KV_REST_API_URL && process.env.KV_REST_API_TOKEN;

// Singleton Redis instance initialised from environment variables.
// This keeps the connection logic in one place and will make it
// straightforward to replace with another provider (e.g. Postgres)
// in the future.
export const redis = hasRedisCredentials ? new Redis({
  url: process.env.KV_REST_API_URL as string,
  token: process.env.KV_REST_API_TOKEN as string,
}) : null;

// Helper functions for deck operations
export const deckCache = {
  async getAll(): Promise<Array<{ fileName: string; deck: Deck }> | null> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return null;
    }
    try {
      const cached = await redis.get('decks');
      return cached ? JSON.parse(cached as string) : null;
    } catch (error) {
      console.error('Failed to get decks from cache:', error);
      return null;
    }
  },

  async setAll(decks: Array<{ fileName: string; deck: Deck }>): Promise<void> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return;
    }
    try {
      await redis.set('decks', JSON.stringify(decks));
    } catch (error) {
      console.error('Failed to cache decks:', error);
    }
  },

  async getOne(fileName: string): Promise<{ fileName: string; deck: Deck } | null> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return null;
    }
    try {
      const allDecks = await this.getAll();
      if (!allDecks) return null;
      return allDecks.find(d => d.fileName === fileName) || null;
    } catch (error) {
      console.error('Failed to get deck from cache:', error);
      return null;
    }
  },

  async invalidate(): Promise<void> {
    if (!redis) {
      console.warn('Redis not configured, skipping cache');
      return;
    }
    try {
      await redis.del('decks');
    } catch (error) {
      console.error('Failed to invalidate cache:', error);
    }
  }
}; 