'use client';

import React, { useEffect, useState } from 'react';
import { CommentCard, type Comment } from '@/entities/comment';

export default function ExamplePage() {
  // 클라이언트에서만 렌더링되도록 상태 만들기
  const [comments, setComments] = useState<{ myComment: Comment; otherComment: Comment } | null>(
    null,
  );

  // 클라이언트에서만 실행되는 코드
  useEffect(() => {
    setComments({
      myComment: {
        id: '1',
        author: {
          id: '1',
          name: '김철수',
          avatarUrl: '',
        },
        content: '내가 작성한 댓글입니다. 더보기 메뉴에는 수정하기와 삭제하기가 표시됩니다.',
        createdAt: new Date().toISOString(),
        isPrivate: false,
      },
      otherComment: {
        id: '2',
        author: {
          id: '2',
          name: '이영희',
          avatarUrl: '',
        },
        content: '다른 사용자가 작성한 댓글입니다. 더보기 메뉴에는 신고하기만 표시됩니다.',
        createdAt: new Date().toISOString(),
        isPrivate: false,
      },
    });
  }, []);

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

  // 데이터가 로드되기 전에는 로딩 상태 표시
  if (!comments) {
    return <div className="container mx-auto p-4">로딩 중...</div>;
  }

  return (
    <div className="container mx-auto p-4 space-y-8">
      <h1 className="text-2xl font-bold mb-4">더보기 메뉴 예제</h1>

      <div className="space-y-6">
        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">내 댓글</h2>
          <CommentCard
            comment={comments.myComment}
            isCurrentUser={true}
            onEdit={handleEdit}
            onDelete={handleDelete}
            onReply={handleReply}
          />
        </div>

        <div className="border rounded-lg p-4">
          <h2 className="text-lg font-medium mb-3">다른 사용자 댓글</h2>
          <CommentCard
            comment={comments.otherComment}
            isCurrentUser={false}
            onReport={handleReport}
            onReply={handleReply}
          />
        </div>
      </div>
    </div>
  );
}
