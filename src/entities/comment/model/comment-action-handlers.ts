import type { CommentWithReplyStatus } from './comment';

export type CommentActionHandlers = {
  handleReplyClick: (commentId: number) => void;
  handleDeleteComment: (commentId: number) => void;
  handleEditComment: (commentId: number, comments: CommentWithReplyStatus[]) => void;
  handleCommentFormSubmit: (
    data: {
      content: string;
      isVisibleToModel: boolean;
      parentCommentId: string | null;
    },
    options: {
      onSuccess: () => void;
    },
  ) => void;
  resetCommentState: () => void;
};
