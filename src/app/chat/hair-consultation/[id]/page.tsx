'use client';

import { useEffect, useState } from 'react';

import { useParams, useSearchParams } from 'next/navigation';

import { useAuthContext } from '@/features/auth/context/auth-context';
import useSendMessage from '@/features/chat/hook/use-send-message';
import { useHairConsultationChatChannelStore } from '@/features/chat/store/hair-consultation-chat-channel-store';
import { useHairConsultationChatMessageStore } from '@/features/chat/store/hair-consultation-chat-message-store';
import { HairConsultationChatMessageTypeEnum } from '@/features/chat/type/hair-consultation-chat-message-type';
import type { UserHairConsultationChatChannelType } from '@/features/chat/type/user-hair-consultation-chat-channel-type';
import ChatDetailMoreButton from '@/features/chat/ui/chat-detail-more-button';
import ChatMessageForm, { type ChatMessageInputValues } from '@/features/chat/ui/chat-message-form';
import MessageSection from '@/features/chat/ui/message-section';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useLoadingContext } from '@/shared/context/loading-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { SiteHeader } from '@/widgets/header';

export default function HairConsultationChatDetailPage() {
  const params = useParams();
  const chatChannelId = params.id as string;
  const searchParams = useSearchParams();
  const isFromApp = searchParams.get(SEARCH_PARAMS.FROM) === 'app';

  const { back } = useRouterWithUser();

  const handleBackClick = () => {
    if (isFromApp) {
      window.closeWebview('close');
    } else {
      back();
    }
  };

  const [userChannel, setUserChannel] = useState<UserHairConsultationChatChannelType | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isInitializing, setIsInitializing] = useState(true);

  const { user } = useAuthContext();
  const userId = user.id.toString();

  const { setLoading } = useLoadingContext();

  const { subscribeToMessages, loading } = useHairConsultationChatMessageStore((state) => ({
    subscribeToMessages: state.subscribeToMessages,
    loading: state.loading,
  }));

  useEffect(() => {
    setLoading(loading);
  }, [loading, setLoading]);

  const {
    userHairConsultationChatChannels,
    updateChannelUserInfo,
    resetUnreadCount,
    subscribeToMine,
  } = useHairConsultationChatChannelStore((state) => ({
    userHairConsultationChatChannels: state.userHairConsultationChatChannels,
    updateChannelUserInfo: state.updateChannelUserInfo,
    resetUnreadCount: state.resetUnreadCount,
    subscribeToMine: state.subscribeToMine,
  }));

  // 웹에서 접근한 경우 리스트에서 채널 찾아서 세팅
  useEffect(() => {
    if (userChannel) return;

    const initializeChannel = async () => {
      const foundUserChannel = userHairConsultationChatChannels.find(
        (channel) => channel.channelId === params.id,
      );

      if (foundUserChannel) {
        setUserChannel(foundUserChannel);
        setError(null);
      } else if (userHairConsultationChatChannels.length > 0) {
        setError('사용자 채널 정보를 찾을 수 없습니다.');
      }

      setIsInitializing(false);
    };

    initializeChannel();
  }, [userHairConsultationChatChannels, params.id, userChannel]);

  // 앱에서 접근한 경우 내 채널 구독
  // => 앱에서는 리스트와 상관없이 해당 채널 방을 바로 웹뷰로 띄우기 때문에 새로운 구독 필요
  useEffect(() => {
    // if (source !== 'app' || !params.id || !userId) {
    //   return;
    // }

    const unsubscribe = subscribeToMine(chatChannelId, userId);

    return () => unsubscribe();
  }, [chatChannelId, userId, subscribeToMine, userChannel]);
  // 앱에서 접근한 경우 내채널 구독후 해당 채널 userChannel로 등록

  //   useEffect(() => {
  //     if (source === 'app' && userHairConsultationChatChannels.length === 1 && !userChannel) {
  //       setUserChannel(userHairConsultationChatChannels[0]);
  //     }
  //   }, [source, userHairConsultationChatChannels, userChannel]);

  useEffect(() => {
    if (chatChannelId) {
      const unsubscribe = subscribeToMessages(chatChannelId);
      return () => unsubscribe();
    }
  }, [chatChannelId, params.id, subscribeToMessages]);

  useEffect(() => {
    if (!userId || !chatChannelId || !userChannel) return;

    // 채팅방 입장 시 상대방 정보 업데이트
    updateChannelUserInfo(chatChannelId, userId);
    resetUnreadCount(chatChannelId, userId);
  }, [userId, chatChannelId, userChannel, updateChannelUserInfo, resetUnreadCount]);

  const sendMessage = useSendMessage();

  async function handleSendMessage(data: ChatMessageInputValues) {
    const message = data.content;
    if (!message.trim() || !userChannel?.otherUser?.id || !userId) {
      return { success: false };
    }

    try {
      return await sendMessage({
        channelId: chatChannelId,
        receiverId: userChannel.otherUser.id.toString(),
        message: message,
        messageType: HairConsultationChatMessageTypeEnum.TEXT,
      });
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      return { success: false, channelId: null };
    }
  }

  //   if (!userId && source !== 'app') {
  //     return <div>로그인이 필요합니다.</div>;
  //   }

  //   if (!userChannel && source !== 'app') {
  //     return <div>채널 정보를 불러오는 중 오류가 발생했습니다.</div>;
  //   }

  //   if (source === 'app' && !userChannel) {
  //     return <CenterSpinner />;
  //   }

  // 로딩 중이거나 초기화 중인 경우
  if (isInitializing) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">채팅방을 불러오는 중...</p>
        </div>
      </div>
    );
  }

  // 에러가 있는 경우
  if (error) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">{error}</p>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  // 채널 정보가 없는 경우
  if (!userChannel) {
    return (
      <div className="h-screen flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">채팅방을 찾을 수 없습니다.</p>
          <button
            onClick={handleBackClick}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen flex flex-col">
      <SiteHeader
        showBackButton
        title={userChannel?.otherUser?.displayName ?? ''}
        rightComponent={
          <ChatDetailMoreButton chatChannel={userChannel} onLeaveChat={handleBackClick} />
        }
        onBackClick={handleBackClick}
      />
      <div className="flex-1 overflow-hidden">
        <MessageSection userChannel={userChannel} />
      </div>
      <ChatMessageForm onSubmit={handleSendMessage} userChannel={userChannel} />
    </div>
  );
}
