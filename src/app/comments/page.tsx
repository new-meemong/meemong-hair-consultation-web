'use client';

import React, { useState } from 'react';
import { CommentList } from '@/widgets/comments/ui/comment-list';
import { MOCK_COMMENTS, CURRENT_USER } from '@/entities/comment/model/mock-data';
import type { CommentWithReplies, Author } from '@/entities/comment/model/types';

export default function CommentsPage() {
  const [comments, setComments] = useState<CommentWithReplies[]>(MOCK_COMMENTS);

  const handleAddComment = (content: string, isPrivate: boolean, parentId?: string) => {
    const newComment = {
      id: `new-${Date.now()}`,
      content,
      author: {
        id: CURRENT_USER.id,
        name: CURRENT_USER.name,
        avatarUrl: CURRENT_USER.avatarUrl || '',
      } as Author,
      createdAt: new Date().toISOString(),
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
