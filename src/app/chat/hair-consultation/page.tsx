'use client';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { useHairConsultationChatChannelStore } from '@/features/chat/store/hair-consultation-chat-channel-store';
import ChatChannelListItem from '@/features/chat/ui/chat-channel-list-item';
import { useEffect } from 'react';

export default function HairConsultationChatPage() {
  const { user } = useAuthContext();
  const userId = user?.id;

  const { chatChannelUserMetas, subscribeToChannels, loading } =
    useHairConsultationChatChannelStore((state) => ({
      chatChannelUserMetas: state.userHairConsultationChatChannelUserMetas,
      subscribeToChannels: state.subscribeToChannels,
      loading: state.loading,
    }));

  console.log('loading', loading);

  console.log(chatChannelUserMetas);

  useEffect(() => {
    if (!userId) return;

    let unsubscribe: () => void;

    try {
      unsubscribe = subscribeToChannels(userId);
    } catch (error) {
      console.error('채널 구독 중 오류 발생:', error);
    }

    return () => {
      if (unsubscribe) {
        try {
          unsubscribe();
        } catch (error) {
          console.error('구독 해제 중 오류 발생:', error);
        }
      }
    };
  }, [userId, subscribeToChannels]);

  return (
    <div className="min-w-[375px] w-full h-screen mx-auto pb-20">
      {chatChannelUserMetas.map((chatChannel) => (
        <ChatChannelListItem key={chatChannel.channelId} chatChannel={chatChannel} />
      ))}
    </div>
  );
}
