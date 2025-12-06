'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { useGetUser } from '@/features/auth/api/use-get-user';
import useIsFromApp from '@/features/chat/hook/use-is-from-app';
import useSendMessage from '@/features/chat/hook/use-send-message';
import { useHairConsultationChatChannelStore } from '@/features/chat/store/hair-consultation-chat-channel-store';
import { useHairConsultationChatMessageStore } from '@/features/chat/store/hair-consultation-chat-message-store';
import { HairConsultationChatMessageTypeEnum } from '@/features/chat/type/hair-consultation-chat-message-type';
import type { UserHairConsultationChatChannelType } from '@/features/chat/type/user-hair-consultation-chat-channel-type';
import ChatDetailMoreButton from '@/features/chat/ui/chat-detail-more-button';
import ChatMessageForm, { type ChatMessageInputValues } from '@/features/chat/ui/chat-message-form';
import ChatPostButtons from '@/features/chat/ui/chat-post-buttons';
import MessageSection from '@/features/chat/ui/message-section';
import { useLoadingContext } from '@/shared/context/loading-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { SiteHeader } from '@/widgets/header';

export default function HairConsultationChatDetailPage() {
  const params = useParams();
  const chatChannelId = params?.id?.toString();
  const isFromApp = useIsFromApp();

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

  const { subscribeToMessages, loading, clearMessages } = useHairConsultationChatMessageStore(
    (state) => ({
      subscribeToMessages: state.subscribeToMessages,
      loading: state.loading,
      clearMessages: state.clearMessages,
    }),
  );

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

  // 웹/앱 모두에서 채널이 없을 때 해당 채널 구독
  // => 직접 URL로 접근한 경우나 앱에서 접근한 경우를 처리
  useEffect(() => {
    if (!chatChannelId || !userId || userChannel) return;

    // 리스트에 채널이 없을 때 해당 채널 구독
    const foundUserChannel = userHairConsultationChatChannels.find(
      (channel) => channel.channelId === chatChannelId,
    );

    if (!foundUserChannel) {
      const unsubscribe = subscribeToMine(chatChannelId, userId);
      return () => unsubscribe();
    }
  }, [chatChannelId, userId, subscribeToMine, userChannel, userHairConsultationChatChannels]);

  // userHairConsultationChatChannels에서 채널 찾아서 userChannel로 설정
  useEffect(() => {
    if (userChannel) return;

    const foundUserChannel = userHairConsultationChatChannels.find(
      (channel) => channel.channelId === params.id,
    );

    if (foundUserChannel) {
      setUserChannel(foundUserChannel);
      setError(null);
      setIsInitializing(false);
    } else if (userHairConsultationChatChannels.length > 0) {
      // 리스트에 채널이 있지만 해당 채널이 없는 경우
      // 약간의 지연 후 다시 확인 (subscribeToMine이 완료될 시간을 줌)
      const timer = setTimeout(() => {
        const retryFound = userHairConsultationChatChannels.find(
          (channel) => channel.channelId === params.id,
        );
        if (retryFound) {
          setUserChannel(retryFound);
          setError(null);
          setIsInitializing(false);
        } else {
          setError('사용자 채널 정보를 찾을 수 없습니다.');
          setIsInitializing(false);
        }
      }, 500);

      return () => clearTimeout(timer);
    }
    // userHairConsultationChatChannels가 비어있는 경우는 아직 로딩 중이므로 기다림
  }, [userHairConsultationChatChannels, params.id, userChannel]);

  // 메시지 구독 (채널 ID만 있으면 구독 가능, userChannel과 무관)
  useEffect(() => {
    if (!chatChannelId) return;

    // 이전 메시지 초기화
    clearMessages();

    // 메시지 구독 시작
    const unsubscribe = subscribeToMessages(chatChannelId);
    return () => {
      unsubscribe();
      clearMessages();
    };
  }, [chatChannelId, subscribeToMessages, clearMessages]);

  // 서버에서 상대방 유저 정보 가져오기 (항상 최신 데이터 사용)
  const otherUserId = userChannel?.otherUserId;
  const { data: otherUserResponse } = useGetUser(otherUserId || '');
  const otherUserFromServer = otherUserResponse?.data;

  useEffect(() => {
    if (!userId || !chatChannelId || !userChannel) return;

    // 채팅방 입장 시 상대방 정보 업데이트 (항상 서버에서 가져와서 Firestore 업데이트)
    updateChannelUserInfo(chatChannelId, userId);
    resetUnreadCount(chatChannelId, userId);
  }, [userId, chatChannelId, userChannel, updateChannelUserInfo, resetUnreadCount]);

  const sendMessage = useSendMessage();

  async function handleSendMessage(data: ChatMessageInputValues) {
    const message = data.content;
    const receiverId = otherUserFromServer?.id || userChannel?.otherUser?.id;
    if (!message.trim() || !receiverId || !userId || !chatChannelId) {
      return { success: false };
    }

    try {
      return await sendMessage({
        channelId: chatChannelId,
        receiverId: receiverId.toString(),
        message: message,
        messageType: HairConsultationChatMessageTypeEnum.TEXT,
      });
    } catch (error) {
      console.error('메시지 전송 실패:', error);
      return { success: false, channelId: null };
    }
  }
  console.log('userChannel', userChannel);

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

  console.log('userChannel', userChannel);

  // 서버에서 가져온 유저 정보를 사용 (없으면 Firestore 데이터 fallback)
  const otherUser = otherUserFromServer || userChannel?.otherUser;
  console.log('moonsae otherUserFromServer', otherUserFromServer);
  return (
    <div className="h-screen flex flex-col">
      <SiteHeader
        showBackButton
        title={otherUser?.DisplayName || otherUser?.displayName || ''}
        rightComponent={
          <ChatDetailMoreButton
            chatChannel={userChannel && otherUser ? { ...userChannel, otherUser } : userChannel}
            onLeaveChat={handleBackClick}
          />
        }
        onBackClick={handleBackClick}
      />
      {/* 게시물 버튼 추가 - 항상 표시, postId가 없으면 비활성화 상태로 표시 */}
      <ChatPostButtons
        postId={userChannel?.postId || ''}
        answerId={userChannel?.answerId}
        userChannel={userChannel && otherUser ? { ...userChannel, otherUser } : userChannel}
      />
      <div className="flex-1 overflow-hidden">
        <MessageSection
          userChannel={userChannel && otherUser ? { ...userChannel, otherUser } : userChannel}
        />
      </div>
      <ChatMessageForm
        onSubmit={handleSendMessage}
        userChannel={userChannel && otherUser ? { ...userChannel, otherUser } : userChannel}
      />
    </div>
  );
}
