import { NextResponse } from 'next/server';

// Import posts from the post route
const getMockPosts = () => {
  // In a real app, this would query a database
  // For now, return some mock data
  return [
    {
      postId: 'post_1',
      fileName: 'spanish-basics',
      deck: {
        id: 'spanish-basics',
        title: 'Spanish Basics',
        description: 'Learn essential Spanish vocabulary and phrases',
        concepts: [
          { id: '1', front: 'Hola', back: 'Hello' },
          { id: '2', front: 'Gracias', back: 'Thank you' },
          { id: '3', front: 'Por favor', back: 'Please' }
        ]
      },
      author: 'Language Learner',
      postedAt: new Date(Date.now() - 86400000).toISOString(), // 1 day ago
      likes: 12
    },
    {
      postId: 'post_2',
      fileName: 'math-algebra',
      deck: {
        id: 'math-algebra',
        title: 'Algebra Fundamentals',
        description: 'Master basic algebraic concepts and equations',
        concepts: [
          { id: '1', front: 'What is 2x + 3 = 7?', back: 'x = 2' },
          { id: '2', front: 'Solve for y: 3y - 5 = 10', back: 'y = 5' }
        ]
      },
      author: 'Math Teacher',
      postedAt: new Date(Date.now() - 172800000).toISOString(), // 2 days ago
      likes: 8
    }
  ];
};

export async function GET() {
  try {
    // In a real app, this would filter only public posts
    const publicPosts = getMockPosts();

    return NextResponse.json({
      success: true,
      data: publicPosts
    });

  } catch (error) {
    console.error('Error fetching public decks:', error);
    return NextResponse.json({
      success: false,
      error: 'Failed to fetch public decks'
    }, { status: 500 });
  }
} 