import type { Deck } from '@/shared/schemas/deck';

export interface DeckResponse {
  success: boolean;
  data?: { fileName: string; deck: Deck };
  error?: string;
  message?: string;
}

export interface DecksListResponse {
  success: boolean;
  data?: Array<{ fileName: string; deck: Deck }>;
  error?: string;
}

export class DecksAPI {
  private static baseUrl = '/api/decks';

  // Get all decks
  static async getAll(): Promise<DecksListResponse> {
    const response = await fetch(this.baseUrl);
    return response.json();
  }

  // Get a specific deck
  static async getOne(fileName: string): Promise<DeckResponse> {
    const response = await fetch(`${this.baseUrl}/${fileName}`);
    return response.json();
  }

  // Create a new deck
  static async create(deck: Omit<Deck, 'id'>): Promise<DeckResponse> {
    const response = await fetch(this.baseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deck),
    });
    return response.json();
  }

  // Update an existing deck
  static async update(fileName: string, deck: Deck): Promise<DeckResponse> {
    const response = await fetch(`${this.baseUrl}/${fileName}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(deck),
    });
    return response.json();
  }

  // Delete a deck
  static async delete(fileName: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await fetch(`${this.baseUrl}/${fileName}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Import deck from file
  static async import(file: File): Promise<DeckResponse> {
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch(`${this.baseUrl}/import`, {
      method: 'POST',
      body: formData,
    });
    return response.json();
  }

  // Export deck (download as JSON)
  static async export(fileName: string, deck: Deck) {
    const jsonString = JSON.stringify(deck, null, 2);
    const blob = new Blob([jsonString], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const link = document.createElement('a');
    link.href = url;
    link.download = `${fileName}.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }
} 