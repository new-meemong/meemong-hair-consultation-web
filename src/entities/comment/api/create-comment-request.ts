export type CreateCommentRequest = {
  content: string;
  /**
   * 모델에게 보이는지 여부 (모델인 경우 반드시 false)
   */
  isVisibleToModel: boolean;
  /**
   * 부모 댓글 ID (첫 댓글인 경우 null, 대댓글인 경우 부모 댓글 ID)
   */
  parentCommentId: string | null;
};
