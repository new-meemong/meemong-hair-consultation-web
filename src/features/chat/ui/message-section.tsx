import { useAuthContext } from '@/features/auth/context/auth-context';
import { useEffect, useRef } from 'react';
import { useHairConsultationChatChannelStore } from '../store/hair-consultation-chat-channel-store';
import { useHairConsultationChatMessageStore } from '../store/hair-consultation-chat-message-store';
import { HairConsultationChatMessageTypeEnum } from '../type/hair-consultation-chat-message-type';
import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';
import MyMessage from './my-message';
import OtherMessage from './other-message';
import SystemMessage from './system-message';

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

  const { updateUserLastReadAt, subscribeToOtherUser, resetUnreadCount } =
    useHairConsultationChatChannelStore((state) => ({
      updateUserLastReadAt: state.updateUserLastReadAt,
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

  return (
    <div className="flex flex-col overflow-y-auto scrollbar-hide px-5 gap-6 h-full">
      {messages.map((message) => {
        if (message.messageType === HairConsultationChatMessageTypeEnum.SYSTEM) {
          return <SystemMessage key={message.id} message={message} />;
        }

        return message.senderId === userId ? (
          <MyMessage
            key={message.id}
            message={message}
            //   source={source}
          />
        ) : (
          <OtherMessage
            key={message.id}
            message={message}
            authorProfileImageUrl={userChannel.otherUser.ProfilePictureURL}
            //   source={source}
          />
        );
      })}
      <div ref={messagesEndRef} /> {/* 스크롤 위치 지정을 위한 요소 */}
    </div>
  );
}
