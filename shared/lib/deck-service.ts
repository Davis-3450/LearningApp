import { promises as fs } from 'fs';
import path from 'path';
import { Deck, DeckSchema } from '../schemas/deck';

const DECKS_DIR = path.join(process.cwd(), 'shared/data/decks');

export class DeckService {
  static async loadDeck(fileName: string): Promise<Deck | null> {
    try {
      const filePath = path.join(DECKS_DIR, `${fileName}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      return DeckSchema.parse(JSON.parse(data));
    } catch {
      return null;
    }
  }

  static async getAllDecksInfo(): Promise<Array<{ fileName: string; deck: Deck }>> {
    try {
      const files = await fs.readdir(DECKS_DIR);
      const decks: Array<{ fileName: string; deck: Deck }> = [];
      for (const file of files) {
        if (!file.endsWith('.json')) continue;
        const fileName = path.parse(file).name;
        const data = await fs.readFile(path.join(DECKS_DIR, file), 'utf8');
        const deck = DeckSchema.parse(JSON.parse(data));
        decks.push({ fileName, deck });
      }
      return decks;
    } catch {
      return [];
    }
  }
}
