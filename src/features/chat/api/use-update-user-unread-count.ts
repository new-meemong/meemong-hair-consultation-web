import { apiClient } from '@/shared/api/client';
import { useMutation } from '@tanstack/react-query';

type UpdateChattingUnreadCountResponse = {
  id: number;
  totalUnreadCount: number;
  createdAt: string;
  updatedAt: string;
  userId: number;
};

const getUpdateChattingUnreadCountEndpoint = () => 'chatting-unread-counts';

/**
 * 안읽은 메시지 수 업데이트
 * @param userId - 업데이트할 사용자 ID
 * @param unreadCount - 변경될 값 (음수는 차감, 양수는 합)
 */
export const updateChattingUnreadCount = async (
  userId: number,
  unreadCount: number,
): Promise<{ data: UpdateChattingUnreadCountResponse }> => {
  const response = await apiClient.post<UpdateChattingUnreadCountResponse>(
    getUpdateChattingUnreadCountEndpoint(),
    {
      userId,
      unreadCount,
    },
  );
  return response;
};

export default function useUpdateChattingUnreadCount() {
  const mutation = useMutation({
    mutationFn: ({ userId, unreadCount }: { userId: number; unreadCount: number }) =>
      updateChattingUnreadCount(userId, unreadCount),
    meta: {
      skipLoadingOverlay: true, // 백그라운드 동기화이므로 로딩 오버레이 표시 안 함
    },
  });

  return {
    mutate: mutation.mutate,
    mutateAsync: mutation.mutateAsync,
    isPending: mutation.isPending,
    error: mutation.error,
    isSuccess: mutation.isSuccess,
  };
}
