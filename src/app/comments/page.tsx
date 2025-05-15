'use client';

import React, { useState, useEffect } from 'react';
import { CommentList } from '@/widgets/comments';
import {
  MOCK_COMMENTS,
  CURRENT_USER,
  type CommentWithReplies,
  type Author,
} from '@/entities/comment';

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentWithReplies[]>([]);

  // mocking data
  useEffect(() => {
    setComments(MOCK_COMMENTS);
  }, []);

  const handleAddComment = (content: string, isPrivate: boolean, parentId?: string) => {
    // 하이드레이션 오류 방지
    const currentTime = new Date().toISOString();

    const newComment = {
      id: `new-${Date.now()}`,
      content,
      author: {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        avatarUrl: CURRENT_USER.avatarUrl || '',
      } as Author,
      createdAt: currentTime,
      isPrivate,
      parentId,
    };

    if (parentId) {
      // 대댓글 추가
      setComments(
        comments.map((comment) => {
          if (comment.id === parentId) {
            return {
              ...comment,
              replies: [...comment.replies, newComment],
            };
          }
          return comment;
        }),
      );
    } else {
      // 새 댓글 추가
      setComments([...comments, { ...newComment, replies: [] } as CommentWithReplies]);
    }
  };

  const handleEditComment = (commentId: string, newContent: string) => {
    setComments(
      comments.map((comment) => {
        // 메인 댓글 수정
        if (comment.id === commentId) {
          return { ...comment, content: newContent };
        }

        // 대댓글 수정
        if (comment.replies.some((reply) => reply.id === commentId)) {
          return {
            ...comment,
            replies: comment.replies.map((reply) =>
              reply.id === commentId ? { ...reply, content: newContent } : reply,
            ),
          };
        }

        return comment;
      }),
    );
  };

  const handleDeleteComment = (commentId: string) => {
    // 메인 댓글 삭제
    const filteredComments = comments.filter((comment) => comment.id !== commentId);

    // 대댓글 삭제
    const updatedComments = filteredComments.map((comment) => ({
      ...comment,
      replies: comment.replies.filter((reply) => reply.id !== commentId),
    }));

    setComments(updatedComments);
  };

  return (
    <div className="max-w-2xl mx-auto py-16 px-4">
      <h1 className="typo-title-1-bold mb-8">댓글 예시</h1>

      <CommentList
        comments={comments}
        currentUserId={CURRENT_USER.id}
        onAddComment={handleAddComment}
        onEditComment={handleEditComment}
        onDeleteComment={handleDeleteComment}
      />
    </div>
  );
}
