export interface User {
  id: string;
  name: string;
  avatarUrl?: string;
  isPrivate?: boolean;
}

export interface Comment {
  id: string;
  content: string;
  author: User;
  createdAt: string;
  isPrivate: boolean;
  parentId?: string; // 대댓글일 경우 부모 댓글 ID
  replies?: Comment[]; // 대댓글 목록
}

export type CommentWithReplies = Comment & {
  replies: Comment[];
};
