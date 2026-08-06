import { apiClient } from '@/shared/api/client';
import { useMutation } from '@tanstack/react-query';

import { ChatChannelTypeEnum } from '../constants/chat-channel-type';

type SendNotificationRequest = {
  userId: string;
  message: string;
  chatChannelId: string;
  schemaVersion: number;
};

const HAIR_CONSULTATION_PUSH_WIRE_TYPE = 'HAIR_CONSULTING' as const;

export default function useSendChatPushNotification() {
  const mutation = useMutation({
    mutationFn: async (data: SendNotificationRequest) => {
      try {
        const response = await apiClient.post('push/chat-messages', {
          ...data,
          chatMessageType: HAIR_CONSULTATION_PUSH_WIRE_TYPE,
          sourceCollection: ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS,
        });
        return response;
      } catch (error) {
        console.error('푸시 알림 API 호출 실패:', error);
        throw error;
      }
    },
    meta: {
      skipLoadingOverlay: true,
      skipGlobalError: true,
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
