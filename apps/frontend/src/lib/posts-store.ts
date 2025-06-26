import { Deck } from '@/shared/schemas/deck';

// In-memory storage for posts (in a real app, this would be a database)
export const posts: Array<{
  postId: string;
  fileName: string;
  deck: Deck;
  author?: string;
  tags?: string[];
  isPublic: boolean;
  postedAt: string;
  likes: number;
}> = []; 