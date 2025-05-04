export interface FeedData {
  id: string;
  author: string;
  title: string;
  content: string;
  imageUrl?: string;
  createdAt: string;
  views: number;
  likes: number;
  comments: number;
}
