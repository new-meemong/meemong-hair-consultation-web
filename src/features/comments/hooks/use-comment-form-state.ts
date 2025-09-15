import { useCallback, useEffect, useRef, useState } from 'react';

import type { Comment } from '@/entities/comment/model/comment';
import useSendCommentPushNotification from '@/features/chat/api/use-send-comment-push-notification';

import type { CommentFormState } from '../types/comment-form-state';
import type { CommentFormValues } from '../ui/comment-form';

import useCommentOperations from './use-comment-operations';

const INITIAL_COMMENT_FORM_STATE: CommentFormState = {
  state: 'create',
  commentId: null,
  content: null,
} as const;
export const useCommentFormState = ({
  postId,
  receiverId,
}: {
  postId: string;
  receiverId: string;
}) => {
  const [commentFormState, setCommentFormState] = useState<CommentFormState>(
    INITIAL_COMMENT_FORM_STATE,
  );
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);
  const shouldFocusRef = useRef(false);

  const { handleCreate, handleUpdate, handleDelete, isCommentCreating, isCommentUpdating } =
    useCommentOperations(postId, commentFormState.commentId);

  const resetCommentState = useCallback(() => {
    setCommentFormState(INITIAL_COMMENT_FORM_STATE);
    shouldFocusRef.current = false;
  }, []);

  const handleReplyClick = useCallback(
    (commentId: number) => {
      if (commentFormState.commentId === commentId) {
        resetCommentState();
      } else {
        shouldFocusRef.current = true;
        setCommentFormState({
          state: 'reply',
          commentId,
          content: null,
        });
      }
    },
    [commentFormState.commentId, resetCommentState],
  );

  const handleEditComment = useCallback((commentId: number, comments?: Comment[]) => {
    const comment = comments?.find((comment) => comment.id === commentId);
    if (!comment) return;

    shouldFocusRef.current = true;
    setTimeout(() => {
      setCommentFormState({
        state: 'edit',
        commentId,
        content: comment.content,
      });
    }, 0);
  }, []);

  useEffect(() => {
    if (shouldFocusRef.current && textareaRef.current) {
      const textarea = textareaRef.current;
      const timeoutId = setTimeout(() => {
        textarea.focus();
        const length = textarea.value.length;
        textarea.setSelectionRange(length, length);
        shouldFocusRef.current = false;
      }, 100);

      return () => clearTimeout(timeoutId);
    }
  }, [commentFormState]);

  const { mutate: sendNotification } = useSendCommentPushNotification();

  const handleCommentFormSubmit = useCallback(
    (data: CommentFormValues, options: { onSuccess: () => void }) => {
      const onSuccess = () => {
        options.onSuccess();
        resetCommentState();
        sendNotification({
          userId: receiverId,
          message: data.content,
        });
      };

      if (commentFormState.state === 'create' || commentFormState.state === 'reply') {
        handleCreate(data, onSuccess);
      } else if (commentFormState.state === 'edit') {
        handleUpdate(data.content, onSuccess);
      }
    },
    [
      commentFormState.state,
      handleCreate,
      handleUpdate,
      receiverId,
      resetCommentState,
      sendNotification,
    ],
  );

  return {
    commentFormState,
    textareaRef,
    isCommentCreating,
    isCommentUpdating,
    handlers: {
      resetCommentState,
      handleReplyClick,
      handleEditComment,
      handleCommentFormSubmit,
      handleDeleteComment: handleDelete,
    },
  };
};
