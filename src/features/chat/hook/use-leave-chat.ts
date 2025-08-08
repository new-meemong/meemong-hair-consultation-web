import { useAuthContext } from '@/features/auth/context/auth-context';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

import { useHairConsultationChatChannelStore } from '../store/hair-consultation-chat-channel-store';
import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';

export default function useLeaveChat() {
  const { user } = useAuthContext();
  const userId = user.id;

  const showModal = useShowModal();

  const { leaveChannel } = useHairConsultationChatChannelStore((state) => ({
    leaveChannel: state.leaveChannel,
  }));

  const handleLeaveChannel = async (
    chatChannel: UserHairConsultationChatChannelType,
    onSuccess: () => void,
  ) => {
    if (!userId) return;
    const { success } = await leaveChannel(
      chatChannel.channelId,
      userId.toString(),
      user.DisplayName,
    );
    if (success) {
      onSuccess();
    }
  };

  const handleLeaveChat = (
    chatChannel: UserHairConsultationChatChannelType,
    { onSuccess }: { onSuccess: () => void },
  ) => {
    showModal({
      id: 'delete-chat-channel-modal',
      text: '채팅방을 나가면 복구할 수 없습니다.\n정말 채팅방에서 나가시겠어요?',
      buttons: [
        {
          label: '나가기',
          textColor: 'text-negative',
          onClick: () => handleLeaveChannel(chatChannel, onSuccess),
        },
        {
          label: '취소',
        },
      ],
    });
  };

  return handleLeaveChat;
}
