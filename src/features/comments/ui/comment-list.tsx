'use client';

import CommentListItem from './comment-list-item';
import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import type { USER_SEX } from '@/entities/user/constants/user-sex';
import type { ValueOf } from '@/shared/type/types';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';

interface CommentListProps {
  comments: CommentWithReplyStatus[];
  postId: string;
  postSource?: 'new' | 'legacy';
  postWriterId: number;
  postWriterSex?: ValueOf<typeof USER_SEX>;
  fetchNextPage: () => void;
  onReplyClick: (commentId: number) => void;
  focusedCommentId: number | null;
  onDelete: (commentId: number) => void;
  onEdit: (commentId: number) => void;
  onReport: (commentId: number) => void;
  onTriggerClick: () => void;
}

export function CommentList({
  comments,
  postId,
  postSource = 'legacy',
  postWriterId,
  postWriterSex,
  fetchNextPage,
  onReplyClick,
  focusedCommentId,
  onDelete,
  onEdit,
  onReport,
  onTriggerClick,
}: CommentListProps) {
  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
  });

  const isFocused = (commentId: number) => focusedCommentId === commentId;

  return (
    <>
      {comments.map((comment, index) => (
        <div key={comment.id} ref={index === comments.length - 2 ? observerRef : undefined}>
          <CommentListItem
            comment={comment}
            postId={postId}
            postSource={postSource}
            postWriterId={postWriterId}
            postWriterSex={postWriterSex}
            onReplyClick={onReplyClick}
            isFocused={isFocused(comment.id)}
            onDelete={() => onDelete(comment.id)}
            onEdit={() => onEdit(comment.id)}
            onReport={() => onReport(comment.id)}
            onTriggerClick={() => onTriggerClick()}
            allComments={comments}
          />
        </div>
      ))}
    </>
  );
}
