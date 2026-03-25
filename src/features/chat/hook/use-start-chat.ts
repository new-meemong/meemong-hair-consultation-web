'use client';

import { ROUTES } from '@/shared';
import { openChatChannelInApp } from '@/shared/lib/app-bridge';
import { useCallback } from 'react';
import { useHairConsultationChatChannelStore } from '@/features/chat/store/hair-consultation-chat-channel-store';
import useIsFromApp from '@/features/chat/hook/use-is-from-app';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

type ChatEntrySource = 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';

type UseStartChatParams = {
  receiverId: number | string;
  postId?: string;
  answerId?: string;
  entrySource?: ChatEntrySource;
  isMyHairConsultationPost?: boolean;
};

/**
 * 채팅 시작을 위한 공통 훅
 * - findOrCreateChannel로 채널 생성/찾기
 * - 네이티브 앱인 경우 window.openChatChannel 호출
 * - 웹인 경우 채팅 상세 페이지로 이동
 */
export default function useStartChat() {
  const auth = useOptionalAuthContext();
  const user = auth?.user ?? null;
  const { push } = useRouterWithUser();
  const isFromApp = useIsFromApp();
  const { findOrCreateChannel } = useHairConsultationChatChannelStore((state) => ({
    findOrCreateChannel: state.findOrCreateChannel,
  }));

  const startChat = useCallback(
    async ({
      receiverId,
      postId,
      answerId,
      entrySource,
      isMyHairConsultationPost,
    }: UseStartChatParams) => {
      if (!user?.id) {
        console.error('사용자 정보가 없습니다.');
        return false;
      }

      try {
        let chatDetailPath = '';

        // 1. 채널 생성 또는 찾기
        // undefined를 null로 변환하여 Firestore에 null로 저장되도록 함
        const result = await findOrCreateChannel({
          senderId: user.id.toString(),
          receiverId: receiverId.toString(),
          postId: postId ?? null,
          answerId: answerId ?? null,
          entrySource,
        });

        if (!result.channelId) {
          console.error('채널 생성에 실패했습니다.');
          return false;
        }
        chatDetailPath = ROUTES.CHAT_HAIR_CONSULTATION_DETAIL(result.channelId);

        // 2. 네이티브 앱인 경우 브릿지 호출
        // null을 undefined로 변환하여 네이티브 앱으로 전달 (타입 정의상 undefined만 허용)
        if (isFromApp) {
          const opened = openChatChannelInApp({
            userId: user.id.toString(),
            chatChannelId: result.channelId,
            postId: postId ?? undefined,
            answerId: answerId ?? undefined,
            entrySource,
            isMyHairConsultationPost,
          });

          if (opened) {
            // 네이티브 브릿지가 응답하지 않는 환경을 대비해 웹 채팅 화면으로 폴백한다.
            setTimeout(() => {
              if (document.visibilityState !== 'visible') return;
              if (window.location.pathname === chatDetailPath) return;
              push(chatDetailPath);
            }, 800);
            return true;
          }
        }

        // 3. 웹인 경우 채팅 상세 페이지로 이동
        push(chatDetailPath);
        return true;
      } catch (error) {
        console.error('채팅 시작 중 오류 발생:', error);
        return false;
      }
    },
    [user?.id, findOrCreateChannel, isFromApp, push],
  );

  return { startChat };
}
