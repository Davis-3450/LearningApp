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

export interface PostDeckResponse {
  success: boolean;
  data?: { postId: string; deck: Deck };
  error?: string;
  message?: string;
}

export interface PublicDecksResponse {
  success: boolean;
  data?: Array<{ 
    postId: string; 
    fileName: string; 
    deck: Deck; 
    author?: string; 
    postedAt: string;
    likes?: number;
  }>;
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

  // Post a deck publicly
  static async postDeck(fileName: string, deck: Deck, metadata?: { 
    author?: string; 
    tags?: string[];
    isPublic?: boolean;
  }): Promise<PostDeckResponse> {
    const response = await fetch(`${this.baseUrl}/post`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        fileName, 
        deck,
        ...metadata
      }),
    });
    return response.json();
  }

  // Get all public decks
  static async getPublicDecks(): Promise<PublicDecksResponse> {
    const response = await fetch(`${this.baseUrl}/public`);
    return response.json();
  }

  // Get user's posted decks
  static async getMyPosts(): Promise<PublicDecksResponse> {
    const response = await fetch(`${this.baseUrl}/my-posts`);
    return response.json();
  }

  // Unpost/make private a deck
  static async unpostDeck(postId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await fetch(`${this.baseUrl}/unpost/${postId}`, {
      method: 'DELETE',
    });
    return response.json();
  }

  // Like a public deck
  static async likeDeck(postId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await fetch(`${this.baseUrl}/like/${postId}`, {
      method: 'POST',
    });
    return response.json();
  }

  // Unlike a public deck
  static async unlikeDeck(postId: string): Promise<{ success: boolean; message?: string; error?: string }> {
    const response = await fetch(`${this.baseUrl}/unlike/${postId}`, {
      method: 'DELETE',
    });
    return response.json();
  }
} 