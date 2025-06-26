export interface Post {
  postId: string;
  fileName: string;
  deck: any;
  author?: string;
  tags?: string[];
  isPublic: boolean;
  postedAt: string;
  likes: number;
}

export const posts: Post[] = [];
