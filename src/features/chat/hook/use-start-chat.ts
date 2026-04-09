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

type PreparedHairConsultationChat = {
  channelId: string;
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

  const prepareChat = useCallback(
    async ({
      receiverId,
      postId,
      answerId,
      entrySource,
      isMyHairConsultationPost,
    }: UseStartChatParams): Promise<PreparedHairConsultationChat | null> => {
      if (!user?.id) {
        console.error('사용자 정보가 없습니다.');
        return null;
      }

      try {
        const result = await findOrCreateChannel({
          senderId: user.id.toString(),
          receiverId: receiverId.toString(),
          postId: postId ?? null,
          answerId: answerId ?? null,
          entrySource,
        });

        if (!result.channelId) {
          console.error('채널 생성에 실패했습니다.');
          return null;
        }

        return {
          channelId: result.channelId,
          postId,
          answerId,
          entrySource,
          isMyHairConsultationPost,
        };
      } catch (error) {
        console.error('채팅 준비 중 오류 발생:', error);
        return null;
      }
    },
    [findOrCreateChannel, user?.id],
  );

  const openPreparedChat = useCallback(
    async ({
      channelId,
      postId,
      answerId,
      entrySource,
      isMyHairConsultationPost,
    }: PreparedHairConsultationChat) => {
      if (!user?.id) {
        console.error('사용자 정보가 없습니다.');
        return false;
      }

      const chatDetailPath = ROUTES.CHAT_HAIR_CONSULTATION_DETAIL(channelId);

      if (isFromApp) {
        const opened = openChatChannelInApp({
          userId: user.id.toString(),
          chatChannelId: channelId,
          postId: postId ?? undefined,
          answerId: answerId ?? undefined,
          entrySource,
          isMyHairConsultationPost,
        });

        if (opened) {
          setTimeout(() => {
            if (document.visibilityState !== 'visible') return;
            if (window.location.pathname === chatDetailPath) return;
            push(chatDetailPath);
          }, 800);
          return true;
        }
      }

      push(chatDetailPath);
      return true;
    },
    [isFromApp, push, user?.id],
  );

  const startChat = useCallback(
    async ({
      receiverId,
      postId,
      answerId,
      entrySource,
      isMyHairConsultationPost,
    }: UseStartChatParams) => {
      const preparedChat = await prepareChat({
        receiverId,
        postId,
        answerId,
        entrySource,
        isMyHairConsultationPost,
      });

      if (!preparedChat) {
        return false;
      }

      return openPreparedChat(preparedChat);
    },
    [openPreparedChat, prepareChat],
  );

  return { startChat, prepareChat, openPreparedChat };
}
