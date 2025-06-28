import { NextRequest, NextResponse } from 'next/server';
import { logger } from '@/lib/logger';

export async function POST(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;

    if (!postId) {
      return NextResponse.json({
        success: false,
        error: 'Post ID is required'
      }, { status: 400 });
    }

    // In a real app, this would update the database
    // For now, just simulate success
    logger.log(`Liked post: ${postId}`);

    return NextResponse.json({
      success: true,
      message: 'Post liked successfully!'
    });

  } catch (error) {
    logger.error('Error liking post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to like post'
    }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  context: { params: Promise<{ postId: string }> }
) {
  try {
    const { postId } = await context.params;

    if (!postId) {
      return NextResponse.json({
        success: false,
        error: 'Post ID is required'
      }, { status: 400 });
    }

    // In a real app, this would update the database
    // For now, just simulate success
    logger.log(`Unliked post: ${postId}`);

    return NextResponse.json({
      success: true,
      message: 'Post unliked successfully!'
    });

  } catch (error) {
    logger.error('Error unliking post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to unlike post'
    }, { status: 500 });
  }
} 