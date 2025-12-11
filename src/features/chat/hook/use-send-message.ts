import type { HairConsultationChatMessageTypeEnum } from '../type/hair-consultation-chat-message-type';
import { removeQueryParams } from '@/shared/lib/remove-query-params';
import { updateChattingUnreadCount } from '../api/use-update-user-unread-count';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useHairConsultationChatMessageStore } from '../store/hair-consultation-chat-message-store';
import useSendChatPushNotification from '../api/use-send-chat-push-notification';

export default function useSendMessage() {
  const { user } = useAuthContext();

  const { sendMessage } = useHairConsultationChatMessageStore((state) => ({
    sendMessage: state.sendMessage,
  }));
  const { mutate: sendNotification } = useSendChatPushNotification();

  const handleSendMessage = async ({
    channelId,
    message,
    messageType,
    receiverId,
  }: {
    channelId: string;
    message: string;
    messageType: HairConsultationChatMessageTypeEnum;
    receiverId: string;
  }) => {
    const { success } = await sendMessage({
      channelId,
      message,
      messageType,
      metaPathList: [
        {
          href: removeQueryParams(window.location.href),
        },
      ],
      senderId: user.id.toString(),
      receiverId,
    });

    if (success) {
      sendNotification({
        userId: receiverId,
        message,
      });

      // 서버 unreadCount 동기화: 상대방의 unreadCount 1 증가
      try {
        await updateChattingUnreadCount(Number(receiverId), 1);
      } catch (error) {
        // 서버 동기화 실패는 로그만 남기고 메시지 전송은 성공 처리
        console.error('서버 unreadCount 동기화 실패 (메시지 전송):', error);
      }
    }

    return { success };
  };

  return handleSendMessage;
}
