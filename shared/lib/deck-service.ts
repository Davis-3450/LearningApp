import { promises as fs } from 'fs';
import path from 'path';
import { DeckSchema, type Deck } from '../schemas/deck';

/**
 * Service for loading and managing decks dynamically from JSON files
 */
export class DeckService {
  private static deckDirectory = path.join(process.cwd(), '../../shared/data/decks');

  /**
   * Loads a specific deck by its filename (without .json extension)
   */
  static async loadDeck(deckFileName: string): Promise<Deck | null> {
    try {
      const filePath = path.join(this.deckDirectory, `${deckFileName}.json`);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);

      // Validate data against our schema
      const deck = DeckSchema.parse(data);
      return deck;
    } catch (error) {
      console.error(`Failed to load deck "${deckFileName}":`, error);
      return null;
    }
  }

  /**
   * Lists all available deck files
   */
  static async listAvailableDecks(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.deckDirectory);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('Failed to list decks:', error);
      return [];
    }
  }

  /**
   * Loads all decks and returns their basic info (id, title, description)
   */
  static async getAllDecksInfo(): Promise<Array<{ fileName: string; deck: Deck }>> {
    const deckFiles = await this.listAvailableDecks();
    const decks: Array<{ fileName: string; deck: Deck }> = [];

    for (const fileName of deckFiles) {
      const deck = await this.loadDeck(fileName);
      if (deck) {
        decks.push({ fileName, deck });
      }
    }

    return decks;
  }
}
