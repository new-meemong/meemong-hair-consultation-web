'use client';

import { Button } from '@/shared/ui/button';
import { ROUTES } from '@/shared';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import { useMemo } from 'react';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

type ChatPostButtonsProps = {
  postId: string;
  answerId?: string;
};

/**
 * 채팅 화면에 표시되는 게시물 관련 버튼 컴포넌트
 * - 원글 보기: 내가 작성한 글인 경우만 표시
 * - 답변 보기: 내가 작성한 글 + 컨설팅 답변이 있는 경우만 표시
 * - 매장예약: 항상 표시
 */
export default function ChatPostButtons({ postId, answerId }: ChatPostButtonsProps) {
  const { user } = useAuthContext();
  const { push } = useRouterWithUser();

  // 게시물 정보 조회 (postId가 있을 때만)
  const { data: postDetailResponse } = useGetPostDetail(postId);
  const postDetail = postDetailResponse?.data;

  // 작성자 확인
  const isPostWriter = useMemo(
    () => postDetail?.hairConsultPostingCreateUserId === user.id,
    [postDetail?.hairConsultPostingCreateUserId, user.id],
  );

  // 컨설팅 답변 존재 여부 확인
  const hasConsultingResponse = postDetail?.isAnsweredByDesigner ?? false;

  // answerId 유효성 체크
  // answerId가 있고, 컨설팅 답변이 존재하는 경우 유효한 것으로 간주
  const isValidAnswerId = useMemo(() => {
    return !!answerId && hasConsultingResponse;
  }, [answerId, hasConsultingResponse]);

  // 버튼 활성화 여부 결정
  const showOriginalPostButton = isPostWriter;
  const showResponseButton = isPostWriter && hasConsultingResponse && isValidAnswerId;
  const showReservationButton = true; // 항상 활성화

  // 원글 보기 클릭 핸들러
  const handleOriginalPostClick = () => {
    if (!postId) return;
    push(ROUTES.POSTS_DETAIL(postId));
  };

  // 답변 보기 클릭 핸들러
  const handleResponseClick = () => {
    if (!postId || !answerId) return;
    push(ROUTES.POSTS_CONSULTING_RESPONSE(postId, answerId));
  };

  // 매장예약 클릭 핸들러
  const handleReservationClick = () => {
    // TODO: 매장예약 링크 처리 로직 구현 필요
    // 현재는 otherUser에서 예약 링크 정보를 가져와야 함
    // userChannel.otherUser?.reservationLink 등을 확인 필요
    console.warn('매장예약 기능은 아직 구현되지 않았습니다.');
  };

  // 게시물 정보가 없거나 로딩 중인 경우 버튼 숨김
  if (!postDetail) {
    return null;
  }

  // 모든 버튼이 비활성화된 경우 렌더링하지 않음
  if (!showOriginalPostButton && !showResponseButton && !showReservationButton) {
    return null;
  }

  return (
    <div className="bg-white border-b border-label-disable sticky top-0 z-10">
      <div className="px-4 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        {showOriginalPostButton && (
          <Button
            theme="whiteBorder"
            size="md"
            onClick={handleOriginalPostClick}
            className="flex-shrink-0 min-h-[44px]"
          >
            원글 보기
          </Button>
        )}
        {showResponseButton && (
          <Button
            theme="whiteBorder"
            size="md"
            onClick={handleResponseClick}
            className="flex-shrink-0 min-h-[44px]"
          >
            답변 보기
          </Button>
        )}
        {showReservationButton && (
          <Button
            theme="black"
            size="md"
            onClick={handleReservationClick}
            className="flex-shrink-0 min-h-[44px]"
          >
            매장예약
          </Button>
        )}
      </div>
    </div>
  );
}
