import { removeQueryParams } from '@/shared/lib/remove-query-params';
import { useHairConsultationChatMessageStore } from '../store/hair-consultation-chat-message-store';
import type { HairConsultationChatMessageTypeEnum } from '../type/hair-consultation-chat-message-type';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useSendPushNotification from '../api/useSendPushNotification';

export default function useSendMessage() {
  const { user } = useAuthContext();

  const { sendMessage } = useHairConsultationChatMessageStore((state) => ({
    sendMessage: state.sendMessage,
  }));
  const { mutate: sendNotification } = useSendPushNotification();

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
    }

    return { success };
  };

  return handleSendMessage;
}
