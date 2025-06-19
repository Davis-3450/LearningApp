import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { postId: string } }
) {
  try {
    const { postId } = params;

    if (!postId) {
      return NextResponse.json({
        success: false,
        error: 'Post ID is required'
      }, { status: 400 });
    }

    // In a real app, this would delete from the database
    // For now, just simulate success
    console.log(`Deleted post: ${postId}`);

    return NextResponse.json({
      success: true,
      message: 'Post deleted successfully!'
    });

  } catch (error) {
    console.error('Error deleting post:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to delete post'
    }, { status: 500 });
  }
} 