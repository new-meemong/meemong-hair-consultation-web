'use client';

import React from 'react';
import { CommentCard } from '@/entities/comment/ui/comment-card';
import { Comment } from '@/entities/comment/model/types';

export default function ExamplePage() {
  const handleEdit = (commentId: string) => {
    alert(`수정하기: ${commentId}`);
  };

  const handleDelete = (commentId: string) => {
    alert(`삭제하기: ${commentId}`);
  };

  const handleReport = (commentId: string) => {
    alert(`신고하기: ${commentId}`);
  };

  const handleReply = (commentId: string) => {
    alert(`답글 달기: ${commentId}`);
  };

  const myComment: Comment = {
    id: '1',
    author: {
      id: '1',
      name: '김철수',
      avatarUrl: '',
    },
    content: '내가 작성한 댓글입니다. 더보기 메뉴에는 수정하기와 삭제하기가 표시됩니다.',
    createdAt: new Date().toISOString(),
    isPrivate: false,
  };

  const otherComment: Comment = {
    id: '2',
    author: {
      id: '2',
      name: '이영희',
      avatarUrl: '',
    },
    content: '다른 사용자가 작성한 댓글입니다. 더보기 메뉴에는 신고하기만 표시됩니다.',
    createdAt: new Date().toISOString(),
    isPrivate: false,
  };

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">더보기 메뉴 예제</h1>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">내 댓글</h2>
          <CommentCard
            comment={myComment}
            isCurrentUser={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReply={handleReply}
          />
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">다른 사용자 댓글</h2>
          <CommentCard
            comment={otherComment}
            isCurrentUser={false}
            onReport={handleReport}
            onReply={handleReply}
          />
        </div>
      </div>
    </div>
  );
}
