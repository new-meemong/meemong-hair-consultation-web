import { USER_ROLE } from '@/entities/user/constants/user-role';
import { apiClient } from '@/shared/api/client';
import { getCurrentUser } from '@/shared/lib/auth';

export async function updateDesignerLastChatReceivedAtAfterSend(
  receiverId: string,
): Promise<void> {
  try {
    const sender = getCurrentUser();
    if (sender?.role !== USER_ROLE.MODEL) return;

    await apiClient.patchNoContent(
      `designers/by-user-id/${receiverId}/last-chat-received-at`,
    );
  } catch (error) {
    console.error('Failed to update designer last chat received at:', error);
  }
}
