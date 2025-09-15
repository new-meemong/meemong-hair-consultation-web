import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/client';

type SendNotificationRequest = {
  userId: string;
  message: string;
};

export default function useSendChatPushNotification() {
  const mutation = useMutation({
    mutationFn: async (data: SendNotificationRequest) => {
      try {
        const response = await apiClient.post('push/chat-messages', data);
        return response;
      } catch (error) {
        console.error('푸시 알림 API 호출 실패:', error);
        throw error;
      }
    },
    meta: {
      skipLoadingOverlay: true,
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
