export interface FeedData {
  id: string;
  author: {
    name: string;
    avatar?: string;
  };
  content: string;
  imageUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
  location?: string;
}
