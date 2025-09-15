import { useMutation } from '@tanstack/react-query';

import { apiClient } from '@/shared/api/client';

type SendCommentPushNotificationRequest = {
  userId: string;
  message: string;
};

export default function useSendCommentPushNotification() {
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
