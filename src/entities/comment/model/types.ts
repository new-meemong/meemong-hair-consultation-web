export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  isPrivate?: boolean;
}

export interface Author {
  id: string;
  name: string;
  avatarUrl: string;
}

export interface Comment {
  id: string;
  author: Author;
  content: string;
  createdAt: string;
  isPrivate: boolean;
  parentId?: string; // 대댓글일 경우 부모 댓글 ID
  replies?: Comment[]; // 대댓글 목록
}

export type CommentWithReplies = Comment & {
  replies: Comment[];
};
