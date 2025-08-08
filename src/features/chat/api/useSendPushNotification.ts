import { jobApiClient } from '@/shared/api/client';
import { useMutation } from '@tanstack/react-query';

type SendNotificationRequest = {
  userId: string;
  message: string;
};

export default function useSendPushNotification() {
  const mutation = useMutation({
    mutationFn: async (data: SendNotificationRequest) => {
      try {
        const response = await jobApiClient.post('push/chat-messages', data);
        return response;
      } catch (error) {
        console.error('푸시 알림 API 호출 실패:', error);
        throw error;
      }
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
