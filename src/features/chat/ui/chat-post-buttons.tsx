'use client';

import HairChatButtonIcon1 from '@/assets/icons/hair-chat-button-icon1.svg';
import HairChatButtonIcon2 from '@/assets/icons/hair-chat-button-icon2.svg';
import HairChatButtonIcon3 from '@/assets/icons/hair-chat-button-icon3.svg';
import { ROUTES } from '@/shared';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';
import { cn } from '@/shared/lib/utils';
import openUrlInApp from '@/shared/lib/open-url-in-app';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useGetHairConsultationDetail from '@/features/posts/api/use-get-hair-consultation-detail';
import { useMemo } from 'react';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

type ChatPostButtonsProps = {
  postId: string | null | undefined;
  answerId?: string | null;
  userChannel?: UserHairConsultationChatChannelType | null;
};

/**
 * 채팅 화면에 표시되는 게시물 관련 버튼 컴포넌트
 * 모델 채팅방: 내 질문, 받은 답변, 예약 링크
 * 디자이너 채팅방: 고객 글, 내 답변, 예약 링크
 */
export default function ChatPostButtons({ postId, answerId, userChannel }: ChatPostButtonsProps) {
  const { user, isUserModel } = useAuthContext();
  const { push } = useRouterWithUser();
  const showModal = useShowModal();

  // postId가 없으면 모든 버튼 비활성화
  const hasPostId = !!postId;

  // 게시물 정보 조회 (postId가 있을 때만, useGetHairConsultationDetail 내부에서 enabled: !!id로 처리됨)
  const {
    data: postDetailResponse,
    isError,
    isLoading,
  } = useGetHairConsultationDetail(postId || '');
  const postDetail = postDetailResponse?.data;

  // 게시물이 삭제되었거나 찾을 수 없는 경우를 감지
  // postId가 없으면 항상 not found로 처리
  const isPostNotFound = !hasPostId || isError || (!isLoading && hasPostId && !postDetail);

  // 작성자 확인 (게시물이 있을 때만)
  const isPostWriter = useMemo(() => {
    if (isPostNotFound || !postDetail) return false;
    const postWriterId =
      postDetail.user?.id ??
      postDetail.hairConsultationCreateUserId ??
      postDetail.hairConsultationCreateUser?.userId;
    return postWriterId === user.id;
  }, [postDetail, user.id, isPostNotFound]);

  // answerId는 userChannel에서도 확인 (props로 전달된 answerId가 없을 수 있음)
  const actualAnswerId = answerId || userChannel?.answerId || '';

  // 컨설팅 답변 존재 여부 확인
  // 채팅방에서는 answerId가 있으면 답변이 존재한다고 간주
  const hasConsultingResponse = useMemo(() => {
    return !!actualAnswerId;
  }, [actualAnswerId]);

  // answerId 유효성 체크
  // answerId가 있으면 유효한 것으로 간주
  const isValidAnswerId = useMemo(() => {
    return !!actualAnswerId;
  }, [actualAnswerId]);

  // 모델인 경우 버튼 활성화 조건
  const isModelOriginalPostEnabled = !isPostNotFound && isPostWriter; // 내 질문
  const isModelResponseEnabled = !isPostNotFound && hasConsultingResponse && isValidAnswerId; // 받은 답변 (answerId가 있고 답변이 있으면 활성화)

  // 디자이너인 경우 버튼 활성화 조건
  const isDesignerPostEnabled = !isPostNotFound; // 고객 글 (게시물이 있으면 활성화)
  const isDesignerResponseEnabled = !isPostNotFound && hasConsultingResponse && isValidAnswerId; // 내 답변 (답변이 있으면 활성화)

  // 예약 링크 활성화 여부 (채팅방의 디자이너(role 2)의 designerInfo.storelink가 있는 경우에만 활성화)
  // 채팅방 참여자 중 디자이너(role 2)를 찾아서 그 디자이너의 designerInfo.storelink 사용
  const storeUrl = useMemo(() => {
    // otherUser가 디자이너(role 2)인 경우
    if (
      userChannel?.otherUser &&
      (userChannel.otherUser.role === USER_ROLE.DESIGNER ||
        userChannel.otherUser.Role === USER_ROLE.DESIGNER)
    ) {
      const otherUser = userChannel.otherUser as {
        designerInfo?: {
          storelink?: string;
        };
        storeUrl?: string;
        storelink?: string;
      };
      // designerInfo.storelink를 우선 사용, 없으면 기존 필드 확인
      return otherUser.designerInfo?.storelink || otherUser.storeUrl || otherUser.storelink || null;
    }

    // otherUser가 디자이너가 아닌 경우, 현재 사용자가 디자이너(role 2)인지 확인
    if (user && (user.role === USER_ROLE.DESIGNER || user.Role === USER_ROLE.DESIGNER)) {
      const currentUser = user as {
        designerInfo?: {
          storelink?: string;
        };
        storeUrl?: string;
        storelink?: string;
      };
      // designerInfo.storelink를 우선 사용, 없으면 기존 필드 확인
      return (
        currentUser.designerInfo?.storelink || currentUser.storeUrl || currentUser.storelink || null
      );
    }

    return null;
  }, [userChannel?.otherUser, user]);

  const isReservationButtonEnabled = !!storeUrl;
  console.log('moonsae storeUrl', storeUrl);
  // 버튼 활성화 여부 결정 (역할에 따라)
  const isFirstButtonEnabled = isUserModel ? isModelOriginalPostEnabled : isDesignerPostEnabled;
  const isSecondButtonEnabled = isUserModel ? isModelResponseEnabled : isDesignerResponseEnabled;

  // 버튼 텍스트 결정
  const firstButtonText = isUserModel ? '내 질문' : '고객 글';
  const secondButtonText = isUserModel ? '받은 답변' : '내 답변';

  // 첫 번째 버튼 클릭 핸들러
  const handleFirstButtonClick = () => {
    if (!isFirstButtonEnabled || !postId) return;
    push(ROUTES.POSTS_NEW_DETAIL(postId));
  };

  // 두 번째 버튼 클릭 핸들러
  const handleSecondButtonClick = () => {
    if (!isSecondButtonEnabled || !postId || !actualAnswerId) return;
    push(ROUTES.POSTS_NEW_CONSULTING_RESPONSE(postId, actualAnswerId));
  };

  // 매장예약 클릭 핸들러
  const handleReservationClick = () => {
    console.log('handleReservationClick called, storeUrl:', storeUrl);
    if (!storeUrl) {
      showModal({
        id: 'no-store-url-modal',
        text: '예약 링크가 등록되지 않았습니다.',
        buttons: [{ label: '확인' }],
      });
      return;
    }

    // 웹에서는 window.open 사용, 앱에서는 openUrlInApp 사용
    if (typeof window.externalLink === 'function') {
      openUrlInApp(storeUrl);
    } else {
      window.open(storeUrl, '_blank', 'noopener,noreferrer');
    }
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
