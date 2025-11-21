import { useCallback, useMemo } from 'react';

import MoreIcon from '@/assets/icons/more-horizontal.svg';

import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

import { MoreOptionsMenu, ROUTES } from '@/shared';

import useLeaveChat from '../hook/use-leave-chat';
import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';

type ChatDetailMoreButtonProps = {
  chatChannel: UserHairConsultationChatChannelType;
  onLeaveChat?: () => void;
};

export default function ChatDetailMoreButton({
  chatChannel,
  onLeaveChat,
}: ChatDetailMoreButtonProps) {
  const router = useRouterWithUser();
  const showModal = useShowModal();

  const handleReport = useCallback(() => {
    router.push(ROUTES.REPORT(chatChannel.otherUser.id.toString()));
  }, [router, chatChannel.otherUser.id]);

  const handleLeaveChat = useLeaveChat();

  const handleLeave = useCallback(() => {
    handleLeaveChat(chatChannel, {
      onSuccess: () => {
        onLeaveChat?.();
      },
    });
  }, [chatChannel, handleLeaveChat, onLeaveChat]);

  const handleBlock = useCallback(() => {
    showModal({
      id: 'block-chat-channel-modal',
      text: `정말 ${chatChannel.otherUser.displayName}님을 차단하시겠습니까?\n차단 해제는 불가합니다.`,
      buttons: [
        {
          label: '차단하기',
          onClick: () => {
            showModal({
              id: 'block-chat-channel-confirm-modal',
              text: '차단되었습니다.',
              buttons: [
                {
                  label: '확인',
                },
              ],
            });
          },
          textColor: 'text-negative',
        },
        {
          label: '취소',
        },
      ],
    });
  }, [chatChannel.otherUser.displayName, showModal]);

  const moreOptions = useMemo(
    () => [
      {
        label: '신고하기',
        onClick: handleReport,
      },
      {
        label: '나가기',
        onClick: handleLeave,
      },
      {
        label: '차단하기',
        onClick: handleBlock,
        className: 'text-negative',
      },
    ],
    [handleReport, handleLeave, handleBlock],
  );

  return (
    <MoreOptionsMenu
      trigger={<MoreIcon className="size-7" />}
      options={moreOptions}
      contentClassName="-right-[14px] "
    />
  );
}
