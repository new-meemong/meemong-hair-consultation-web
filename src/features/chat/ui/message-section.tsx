import { useEffect, useRef } from 'react';
import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';
import { useHairConsultationChatMessageStore } from '../store/hair-consultation-chat-message-store';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useHairConsultationChatChannelStore } from '../store/hair-consultation-chat-channel-store';
import type { Timestamp } from 'firebase/firestore';
import {
  HairConsultationChatMessageTypeEnum,
  type HairConsultationChatMessageType,
} from '../type/hair-consultation-chat-message-type';
import SystemMessage from './system-message';
import ChatMessageForm from './chat-message-form';

type MessageSectionProps = {
  userChannel: UserHairConsultationChatChannelType;
};

export default function MessageSection({ userChannel }: MessageSectionProps) {
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const { messages, clearMessages, loading } = useHairConsultationChatMessageStore((state) => ({
    messages: state.messages,
    clearMessages: state.clearMessages,
    loading: state.loading,
  }));

  const { user } = useAuthContext();
  const userId = user.id.toString();

  const {
    updateUserLastReadAt,
    otherUserHairConsultationChatChannel,
    subscribeToOtherUser,
    resetUnreadCount,
  } = useHairConsultationChatChannelStore((state) => ({
    updateUserLastReadAt: state.updateUserLastReadAt,
    otherUserHairConsultationChatChannel: state.otherUserHairConsultationChatChannel,
    subscribeToOtherUser: state.subscribeToOtherUser,
    resetUnreadCount: state.resetUnreadCount,
  }));

  useEffect(() => {
    if (!userChannel.channelId || !userChannel.otherUser?.id) return;

    const unsubscribe = subscribeToOtherUser(
      userChannel.channelId,
      userChannel.otherUser.id.toString(),
    );

    return () => {
      unsubscribe();
    };
  }, [subscribeToOtherUser, userChannel.channelId, userChannel.otherUser.id]);

  useEffect(() => {
    if (!userChannel.channelId || !userId || loading) return;

    // 메시지가 변경될 때마다 lastReadAt 업데이트
    updateUserLastReadAt(userChannel.channelId, userId);
  }, [userChannel.channelId, userId, messages.length, loading, updateUserLastReadAt]);

  // cleanup을 위한 별도 useEffect
  useEffect(() => {
    return () => {
      if (userId && userChannel.channelId) {
        resetUnreadCount(userChannel.channelId, userId);
        clearMessages();
      }
    };
  }, [clearMessages, resetUnreadCount, userChannel.channelId, userId]);

  useEffect(() => {
    if (!userChannel?.channelId || !userId) return;

    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updateUserLastReadAt(userChannel.channelId, userId);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [updateUserLastReadAt, userChannel.channelId, userId]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // 채팅방 첫 접속시 스크롤 아래로
  useEffect(() => {
    if (!loading) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'instant' });
    }
  }, [loading]);

  // 새 메시지가 올 때마다 스크롤 아래로
  useEffect(() => {
    scrollToBottom();
  }, [messages.length]);

  const checkIsRead = (messageCreatedAt: Timestamp, message: HairConsultationChatMessageType) => {
    // 내가 보낸 메시지인 경우에만 상대방의 lastReadAt 확인
    if (userId === message.senderId) {
      const otherLastReadAt = otherUserHairConsultationChatChannel?.lastReadAt as Timestamp | null;
      return otherLastReadAt ? messageCreatedAt?.toMillis() <= otherLastReadAt?.toMillis() : false;
    }
    return true; // 상대방 메시지는 항상 false 반환
  };

  console.log('messages', messages);

  return (
    <div className="flex-1 overflow-y-auto scrollbar-hide">
      {messages.map((message) => {
        const messageCreatedAt = message.createdAt as Timestamp;
        const isRead = checkIsRead(messageCreatedAt, message);

        if (message.messageType === HairConsultationChatMessageTypeEnum.SYSTEM) {
          return <SystemMessage key={message.id} message={message} />;
        }

        //   return message.senderId === userId ? (
        //     <MyMessage key={message.id} message={message} isRead={isRead} source={source} />
        //   ) : (
        //     <OtherMessage
        //       key={message.id}
        //       message={message}
        //       userChannel={userChannel}
        //       source={source}
        //     />
        //   );
      })}
      <div ref={messagesEndRef} /> {/* 스크롤 위치 지정을 위한 요소 */}
    </div>
  );
}
