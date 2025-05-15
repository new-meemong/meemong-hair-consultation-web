export interface Feed {
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

export interface Banner {
  id: string;
  title: string;
  subtitle: string;
  bgColor: string;
}
