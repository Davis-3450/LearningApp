import { NextResponse } from 'next/server';
import { Deck } from '@/lib/types';

export async function GET() {
  try {
    // In a real app, this would filter posts by the authenticated user
    // For now, return empty array or mock user posts
    const myPosts: Array<{
      postId: string;
      fileName: string;
      deck: Deck;
      author?: string;
      postedAt: string;
      likes: number;
    }> = [
      // Mock data - in real app, filter by user ID
    ];

    return NextResponse.json({
      success: true,
      data: myPosts
    });

  } catch (error) {
    console.error('Error fetching user posts:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch user posts'
    }, { status: 500 });
  }
} 