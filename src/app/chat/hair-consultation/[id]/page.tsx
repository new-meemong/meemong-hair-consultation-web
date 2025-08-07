'use client';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { useHairConsultationChatChannelStore } from '@/features/chat/store/hair-consultation-chat-channel-store';
import { useHairConsultationChatMessageStore } from '@/features/chat/store/hair-consultation-chat-message-store';
import { HairConsultationChatMessageTypeEnum } from '@/features/chat/type/hair-consultation-chat-message-type';
import type { UserHairConsultationChatChannelType } from '@/features/chat/type/user-hair-consultation-chat-channel-type';
import ChatDetailMoreButton from '@/features/chat/ui/chat-detail-more-button';
import ChatMessageForm, { type ChatMessageInputValues } from '@/features/chat/ui/chat-message-form';
import MessageSection from '@/features/chat/ui/message-section';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function HairConsultationChatDetailPage() {
  const params = useParams();
  const chatChannelId = params.id as string;
  // const searchParams = useSearchParams();
  // const source = searchParams.get("source") || "web";

  const [userChannel, setUserChannel] = useState<UserHairConsultationChatChannelType | null>(null);

  const [error, setError] = useState<string | null>(null);

  const { user } = useAuthContext();
  const userId = user.id.toString();

  const { subscribeToMessages, sendMessage } = useHairConsultationChatMessageStore((state) => ({
    subscribeToMessages: state.subscribeToMessages,
    sendMessage: state.sendMessage,
  }));

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
      //   if (source === 'app') {
      //     return;
      //   }

      const foundUserChannel = userHairConsultationChatChannels.find(
        (channel) => channel.channelId === params.id,
      );

      if (foundUserChannel) {
        setUserChannel(foundUserChannel);
      } else if (userHairConsultationChatChannels.length > 0) {
        setError('사용자 채널 정보를 찾을 수 없습니다.');
      }
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
    if (!userId || !chatChannelId) return;

    // 채팅방 입장 시 상대방 정보 업데이트
    updateChannelUserInfo(chatChannelId, userId);
    resetUnreadCount(chatChannelId, userId);
  }, [userId, chatChannelId, updateChannelUserInfo, resetUnreadCount]);

  async function handleSendMessage(data: ChatMessageInputValues) {
    const message = data.content;
    if (!message.trim() || !userChannel?.otherUser?.id || !userId) {
      return { success: false, channelId: null };
    }

    try {
      return await sendMessage({
        channelId: chatChannelId,
        senderId: userId, // TODO: 실제 사용자 ID로 교체 필요
        receiverId: userChannel.otherUser.id.toString(),
        message: message,
        messageType: HairConsultationChatMessageTypeEnum.TEXT,
      });

      //TODO: 푸시 알림보내기 api 확인
      //   await sendPushNotification(userChannel.otherUser.id, messageText);
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

  if (!userChannel) return null;

  return (
    <div className="h-screen flex flex-col">
      <SiteHeader
        showBackButton
        title={userChannel?.otherUser?.DisplayName ?? ''}
        rightComponent={<ChatDetailMoreButton />}
      />
      <div className="flex-1 overflow-hidden">
        <MessageSection userChannel={userChannel} />
      </div>
      <ChatMessageForm onSubmit={handleSendMessage} />
    </div>
  );
}
