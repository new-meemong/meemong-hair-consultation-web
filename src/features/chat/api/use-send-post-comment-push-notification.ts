import type { SendCommentPushNotificationRequest } from '@/entities/comment/api/send-push-notification-request';
import { apiClient } from '@/shared/api/client';
import { useMutation } from '@tanstack/react-query';

export default function useSendPostCommentPushNotification() {
  const mutation = useMutation({
    mutationFn: (data: SendCommentPushNotificationRequest) => {
      return apiClient.post('push/hair-consulting-replies', data);
    },
    meta: { skipGlobalError: true },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
