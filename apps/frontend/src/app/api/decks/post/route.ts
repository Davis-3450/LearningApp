import { NextRequest, NextResponse } from 'next/server';
import { Deck } from '@/shared/schemas/deck';
import { posts, type Post } from '../posts-store';

// In-memory storage for posts (in a real app, this would be a database)

export async function POST(request: NextRequest) {
  try {
    const { fileName, deck, author, tags, isPublic } = await request.json();

    if (!fileName || !deck) {
      return NextResponse.json({
        success: false,
        error: 'Missing required fields: fileName and deck'
      }, { status: 400 });
    }

    // Generate a unique post ID
    const postId = `post_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Create the post
    const newPost = {
      postId,
      fileName,
      deck,
      author: author || 'Anonymous',
      tags: tags || [],
      isPublic: isPublic !== false, // Default to public
      postedAt: new Date().toISOString(),
      likes: 0
    };

    posts.push(newPost);

    return NextResponse.json({
      success: true,
      data: {
        postId,
        deck
      },
      message: 'Deck posted successfully!'
    });

  } catch (error) {
    console.error('Error posting deck:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to post deck'
    }, { status: 500 });
  }
}

// Export posts for other routes to access
