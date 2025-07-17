import { MOCK_COMMENTS, type Comment, type CommentWithReplies } from '@/entities/comment';

/**
 * 댓글 목록 조회
 * @param postId 게시글 ID
 * @returns 댓글 목록
 */
export const fetchComments = (postId?: string): Promise<CommentWithReplies[]> => {
  return new Promise((resolve) => {
    // postId는 향후 실제 API 연동 시 사용될 예정
    console.log('Fetching comments for post:', postId);
    setTimeout(() => {
      resolve(MOCK_COMMENTS);
    }, 300);
  });
};

// 댓글 수정 API 요청 타입
export interface UpdateCommentRequest {
  commentId: string;
  content: string;
}

/**
 * 댓글 수정
 * @param data 댓글 수정 데이터
 * @returns 수정된 댓글
 */
export const updateComment = ({ commentId, content }: UpdateCommentRequest): Promise<Comment> => {
  return new Promise((resolve, reject) => {
    // 실제 구현에서는 서버에 요청을 보내 댓글을 수정하고 응답을 받음
    // 여기서는 목업 데이터만 사용

    // 전체 댓글 중 해당 ID를 가진 댓글 찾기
    let foundComment: Comment | undefined;

    for (const comment of MOCK_COMMENTS) {
      if (comment.id === commentId) {
        foundComment = { ...comment, content };
        break;
      }

      // 대댓글 확인
      const reply = comment.replies.find((reply) => reply.id === commentId);
      if (reply) {
        foundComment = { ...reply, content };
        break;
      }
    }

    if (foundComment) {
      setTimeout(() => {
        resolve(foundComment as Comment);
      }, 300);
    } else {
      reject(new Error('댓글을 찾을 수 없습니다.'));
    }
  });
};

/**
 * 댓글 삭제
 * @param commentId 삭제할 댓글 ID
 * @returns 성공 여부
 */
export const deleteComment = (commentId: string): Promise<{ success: boolean }> => {
  return new Promise((resolve) => {
    // commentId는 향후 실제 API 연동 시 사용될 예정
    console.log('Deleting comment:', commentId);
    // 실제 구현에서는 서버에 삭제 요청을 보내고 응답을 받음
    setTimeout(() => {
      resolve({ success: true });
    }, 300);
  });
};
