'use client';

import HairChatButtonIcon1 from '@/assets/icons/hair-chat-button-icon1.svg';
import HairChatButtonIcon2 from '@/assets/icons/hair-chat-button-icon2.svg';
import HairChatButtonIcon3 from '@/assets/icons/hair-chat-button-icon3.svg';
import { ROUTES } from '@/shared';
import { cn } from '@/shared/lib/utils';
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
 * 모델 채팅방: 내 질문, 받은 답변, 예약 링크
 * 디자이너 채팅방: 고객 글, 내 답변, 예약 링크
 */
export default function ChatPostButtons({ postId, answerId }: ChatPostButtonsProps) {
  const { user, isUserModel } = useAuthContext();
  const { push } = useRouterWithUser();

  // 게시물 정보 조회 (postId가 있을 때만)
  const { data: postDetailResponse, isError, isLoading } = useGetPostDetail(postId);
  const postDetail = postDetailResponse?.data;

  // 게시물이 삭제되었거나 찾을 수 없는 경우를 감지
  const isPostNotFound = isError || (!isLoading && !postDetail);

  // 작성자 확인 (게시물이 있을 때만)
  const isPostWriter = useMemo(() => {
    if (isPostNotFound || !postDetail) return false;
    return postDetail.hairConsultPostingCreateUserId === user.id;
  }, [postDetail, user.id, isPostNotFound]);

  // 컨설팅 답변 존재 여부 확인 (게시물이 있을 때만)
  const hasConsultingResponse = postDetail?.isAnsweredByDesigner ?? false;

  // answerId 유효성 체크
  // answerId가 있고, 컨설팅 답변이 존재하는 경우 유효한 것으로 간주
  const isValidAnswerId = useMemo(() => {
    if (isPostNotFound || !postDetail) return false;
    return !!answerId && hasConsultingResponse;
  }, [answerId, hasConsultingResponse, isPostNotFound, postDetail]);

  // 모델인 경우 버튼 활성화 조건
  const isModelOriginalPostEnabled = !isPostNotFound && isPostWriter; // 내 질문
  const isModelResponseEnabled =
    !isPostNotFound && isPostWriter && hasConsultingResponse && isValidAnswerId; // 받은 답변

  // 디자이너인 경우 버튼 활성화 조건
  const isDesignerPostEnabled = !isPostNotFound; // 고객 글 (게시물이 있으면 활성화)
  const isDesignerResponseEnabled = !isPostNotFound && hasConsultingResponse && isValidAnswerId; // 내 답변 (답변이 있으면 활성화)

  // 예약 링크는 항상 활성화
  const isReservationButtonEnabled = true; // TODO: 예약 링크 존재 여부에 따라 결정

  // 버튼 활성화 여부 결정 (역할에 따라)
  const isFirstButtonEnabled = isUserModel ? isModelOriginalPostEnabled : isDesignerPostEnabled;
  const isSecondButtonEnabled = isUserModel ? isModelResponseEnabled : isDesignerResponseEnabled;

  // 버튼 텍스트 결정
  const firstButtonText = isUserModel ? '내 질문' : '고객 글';
  const secondButtonText = isUserModel ? '받은 답변' : '내 답변';

  // 첫 번째 버튼 클릭 핸들러
  const handleFirstButtonClick = () => {
    if (!isFirstButtonEnabled || !postId) return;
    push(ROUTES.POSTS_DETAIL(postId));
  };

  // 두 번째 버튼 클릭 핸들러
  const handleSecondButtonClick = () => {
    if (!isSecondButtonEnabled || !postId || !answerId) return;
    push(ROUTES.POSTS_CONSULTING_RESPONSE(postId, answerId));
  };

  // 매장예약 클릭 핸들러
  const handleReservationClick = () => {
    if (!isReservationButtonEnabled) return;
    // TODO: 매장예약 링크 처리 로직 구현 필요
    // 현재는 otherUser에서 예약 링크 정보를 가져와야 함
    // userChannel.otherUser?.reservationLink 등을 확인 필요
    console.warn('매장예약 기능은 아직 구현되지 않았습니다.');
  };

  // 버튼 공통 스타일
  const buttonBaseStyle =
    'flex items-center justify-center gap-1 rounded-6 border border-border-default bg-white h-[35px] w-[109px] px-3 transition-colors';
  const buttonEnabledStyle = 'text-label-sub cursor-pointer';
  const buttonDisabledStyle = 'text-label-placeholder cursor-not-allowed';

  return (
    <div className="bg-white border-b border-label-disable sticky top-0 z-10">
      <div className="px-4 py-3 flex gap-2 justify-center overflow-x-auto scrollbar-hide">
        {/* 첫 번째 버튼 (모델: 내 질문, 디자이너: 고객 글) */}
        <button
          type="button"
          onClick={handleFirstButtonClick}
          disabled={!isFirstButtonEnabled}
          className={cn(
            buttonBaseStyle,
            isFirstButtonEnabled ? buttonEnabledStyle : buttonDisabledStyle,
          )}
        >
          <HairChatButtonIcon1 className="size-4 flex-shrink-0" />
          <span
            className="typo-body-2-medium whitespace-nowrap"
            style={{ fontSize: '15px', fontWeight: 500 }}
          >
            {firstButtonText}
          </span>
        </button>

        {/* 두 번째 버튼 (모델: 받은 답변, 디자이너: 내 답변) */}
        <button
          type="button"
          onClick={handleSecondButtonClick}
          disabled={!isSecondButtonEnabled}
          className={cn(
            buttonBaseStyle,
            isSecondButtonEnabled ? buttonEnabledStyle : buttonDisabledStyle,
          )}
        >
          <HairChatButtonIcon2 className="size-4 flex-shrink-0" />
          <span
            className="typo-body-2-medium whitespace-nowrap"
            style={{ fontSize: '15px', fontWeight: 500 }}
          >
            {secondButtonText}
          </span>
        </button>

        {/* 예약 링크 버튼 */}
        <button
          type="button"
          onClick={handleReservationClick}
          disabled={!isReservationButtonEnabled}
          className={cn(
            buttonBaseStyle,
            isReservationButtonEnabled ? buttonEnabledStyle : buttonDisabledStyle,
          )}
        >
          <HairChatButtonIcon3 className="size-4 flex-shrink-0" />
          <span
            className="typo-body-2-medium whitespace-nowrap"
            style={{ fontSize: '15px', fontWeight: 500 }}
          >
            예약 링크
          </span>
        </button>
      </div>
    </div>
  );
}
