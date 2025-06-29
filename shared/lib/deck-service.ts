import { promises as fs } from 'fs';
import path from 'path';
import { DeckSchema, type Deck } from '../schemas/deck';

// This service now primarily loads initial data. Runtime data is handled in memory.

export class DeckService {
  private static deckDirectory = path.join(process.cwd(), 'shared', 'data', 'decks');

  static async loadDeck(deckFileName: string): Promise<Deck | null> {
    try {
      const filePath = path.join(this.deckDirectory, `${deckFileName}.json`);
      const fileContent = await fs.readFile(filePath, 'utf8');
      const data = JSON.parse(fileContent);
      return DeckSchema.parse(data);
    } catch (error) {
      console.error(`Failed to load deck "${deckFileName}" from filesystem:`, error);
      return null;
    }
  }

  static async listAvailableDecks(): Promise<string[]> {
    try {
      const files = await fs.readdir(this.deckDirectory);
      return files
        .filter(file => file.endsWith('.json'))
        .map(file => file.replace('.json', ''));
    } catch (error) {
      console.error('Failed to list decks from filesystem:', error);
      return [];
    }
  }

  static async getAllDecksInfo(): Promise<Array<{ fileName: string; deck: Deck }>> {
    const deckFiles = await this.listAvailableDecks();
    const decks = [];

    for (const fileName of deckFiles) {
      const deck = await this.loadDeck(fileName);
      if (deck) {
        decks.push({ fileName, deck });
      }
    }

    return decks;
  }
}