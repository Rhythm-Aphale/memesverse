// types/meme.ts
export type Meme = {
    id: string;
    name: string;
    url: string;
    likes: number;
    comments: Comment[];
    createdAt: Date;
    category: 'trending' | 'new' | 'classic' | 'random';
    width?: number;
    height?: number;
  };
  
  export type Comment = {
    id: string;
    text: string;
    author: string;
    createdAt: Date;
  };
  
  export type UserProfile = {
    id: string;
    name: string;
    bio: string;
    avatar: string;
    memes: Meme[];
  };