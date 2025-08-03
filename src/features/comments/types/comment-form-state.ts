export type CommentFormState = {
  state: 'create' | 'edit' | 'reply';
  commentId: number | null;
  content: string | null;
};
