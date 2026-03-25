import { apiClient } from '@/shared/api/client';
import { useMutation } from '@tanstack/react-query';

type SendConsultingAnswerPushNotificationRequest = {
  userId: string;
};

export default function useSendConsultingAnswerPushNotification() {
  const mutation = useMutation({
    mutationFn: (data: SendConsultingAnswerPushNotificationRequest) => {
      return apiClient.post('push/hair-consulting-answers', data);
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
