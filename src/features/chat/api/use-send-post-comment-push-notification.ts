import { useMutation } from '@tanstack/react-query';

import type { SendCommentPushNotificationRequest } from '@/entities/comment/api/send-push-notification-request';

import { apiClient } from '@/shared/api/client';

export default function useSendPostCommentPushNotification() {
  const mutation = useMutation({
    mutationFn: (data: SendCommentPushNotificationRequest) => {
      return apiClient.post('push/hair-consulting-replies', data);
    },
  });

  return {
    mutate: mutation.mutate,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
