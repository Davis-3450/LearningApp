import { promises as fs } from 'fs';
import path from 'path';
import { Deck, DeckSchema } from '../schemas/deck';

const DATA_DIR = path.join(process.cwd(), 'shared/data/decks');

export class DeckService {
  static async loadDeck(fileName: string): Promise<Deck | null> {
    try {
      const filePath = path.join(DATA_DIR, `${fileName}.json`);
      const data = await fs.readFile(filePath, 'utf8');
      return DeckSchema.parse(JSON.parse(data));
    } catch {
      return null;
    }
  }

  static async getAllDecksInfo(): Promise<Array<{ fileName: string; deck: Deck }>> {
    try {
      const files = await fs.readdir(DATA_DIR);
      const decks = [] as Array<{ fileName: string; deck: Deck }>;
      for (const file of files) {
        if (file.endsWith('.json')) {
          const deck = await this.loadDeck(path.basename(file, '.json'));
          if (deck) decks.push({ fileName: path.basename(file, '.json'), deck });
        }
      }
      return decks;
    } catch {
      return [];
    }
  }
}
