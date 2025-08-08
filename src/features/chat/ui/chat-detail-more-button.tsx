import { MoreOptionsMenu, ROUTES } from '@/shared';
import { useCallback, useMemo } from 'react';
import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import useLeaveChat from '../hook/use-leave-chat';
import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';

type ChatDetailMoreButtonProps = {
  chatChannel: UserHairConsultationChatChannelType;
};

export default function ChatDetailMoreButton({ chatChannel }: ChatDetailMoreButtonProps) {
  const router = useRouterWithUser();

  const handleReport = useCallback(() => {
    router.push(ROUTES.REPORT(chatChannel.otherUser.id.toString()));
  }, [router, chatChannel.otherUser.id]);

  const handleLeaveChat = useLeaveChat();

  const handleLeave = useCallback(() => {
    handleLeaveChat(chatChannel, {
      onSuccess: () => {
        router.back();
      },
    });
  }, [handleLeaveChat, router, chatChannel]);

  const handleBlock = useCallback(() => {
    console.log('차단하기');
  }, []);

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
