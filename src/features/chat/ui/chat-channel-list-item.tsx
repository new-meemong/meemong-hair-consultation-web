import { useRouter, useSearchParams } from 'next/navigation';
import Image from 'next/image';
import { format } from 'date-fns';
import { useState, type ReactNode } from 'react';
import { useHairConsultationChatChannelStore } from '@/features/chat/store/hair-consultation-chat-channel-store';
import type { UserHairConsultationChatChannelType } from '@/features/chat/type/user-hair-consultation-chat-channel-type';
import { useAuthContext } from '@/features/auth/context/auth-context';
import PinIcon from '@/assets/icons/pin.svg';
import PinOffIcon from '@/assets/icons/pin-off.svg';
import ChatTrashIcon from '@/assets/icons/chat-trash.svg';
import { cn } from '@/lib/utils';
import useShowModal from '@/shared/ui/hooks/use-show-modal';

function ActionButton({
  children,
  className,
  onClick,
}: {
  children: ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <button
      className={cn('flex items-center justify-center w-23 h-full', className)}
      onClick={onClick}
    >
      {children}
    </button>
  );
}

type ChatChannelListItemProps = {
  chatChannel: UserHairConsultationChatChannelType;
};

export default function ChatChannelListItem({ chatChannel }: ChatChannelListItemProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false);

  const { user } = useAuthContext();
  const userId = user.id;

  const { pinChannel, unpinChannel, leaveChannel } = useHairConsultationChatChannelStore(
    (state) => ({
      pinChannel: state.pinChannel,
      unpinChannel: state.unpinChannel,
      leaveChannel: state.leaveChannel,
    }),
  );

  const handleTouchStart = (e: React.TouchEvent) => {
    setStartX(e.touches[0].clientX);
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    const currentX = e.touches[0].clientX;
    const diff = startX - currentX;
    const newOffset = Math.max(-92, Math.min(0, -diff));
    setOffset(newOffset);
  };

  const handleTouchEnd = () => {
    if (offset < -40) {
      setOffset(-184);
    } else {
      setOffset(0);
    }
  };

  const handlePinClick = async () => {
    try {
      if (chatChannel.isPinned) {
        await unpinChannel(chatChannel.channelId, userId.toString());
      } else {
        await pinChannel(chatChannel.channelId, userId.toString());
      }
      setOffset(0);
    } catch (error) {
      console.error('채널 고정 상태 변경 실패:', error);
    }
  };

  const handleChannelClick = () => {
    // const source = searchParams.get('source');

    // if (!UserID) return;

    // if (source === SourceType.APP && window.openChatChannel) {
    //   window.openChatChannel({
    //     userId: UserID,
    //     chatChannelId: chatChannel.channelId,
    //   });
    // }

    // if (!source || source === SourceType.WEB) {
    router.push(`/chat/hair-consultation/${chatChannel.channelId}`);
    // }
  };

  const showModal = useShowModal();

  const handleDeleteClick = () => {
    showModal({
      id: 'delete-chat-channel-modal',
      text: '채팅방을 나가면 복구할 수 없습니다.\n정말 채팅방에서 나가시겠어요?',
      buttons: [
        {
          label: '나가기',
          textColor: 'text-negative',
          onClick: handleLeaveChannel,
        },
        {
          label: '취소',
        },
      ],
    });
  };

  const handleLeaveChannel = async () => {
    if (!userId) return;
    try {
      await leaveChannel(chatChannel.channelId, userId.toString(), user?.DisplayName || '');
      setOffset(0);
    } catch (error) {
      console.error('채널 나가기 실패:', error);
    }
  };

  const { lastMessage, otherUser } = chatChannel;
  const userImage = otherUser?.ProfilePictureURL || '/profile.svg';

  return (
    <div className="relative w-full overflow-hidden z-1 flex items-center">
      <div
        className={cn(
          'flex gap-4 px-6 py-5 transform transition-transform duration-300 ease-in-out bg-white z-1 w-full items-center h-full',
        )}
        style={{ transform: `translateX(${offset}px)` }}
        onTouchStart={handleTouchStart}
        onTouchMove={handleTouchMove}
        onTouchEnd={handleTouchEnd}
        onClick={handleChannelClick}
      >
        <Image
          src={userImage}
          alt="User profile"
          width={60}
          height={60}
          className="size-15 rounded-4 object-cover"
        />
        <div className="flex flex-col gap-2 flex-1">
          <div className="flex items-center gap-0.5">
            {chatChannel.isPinned && <PinIcon className="size-4 fill-label-info" />}
            <p className="typo-headline-bold text-label-strong">
              {otherUser?.DisplayName || '알수없음'}
            </p>
          </div>
          <p className="typo-body-2-long-regular text-label-info  overflow-hidden text-ellipsis line-clamp-2 break-words whitespace-pre-wrap">
            {lastMessage.message}
          </p>
        </div>
        <div className="flex flex-col items-end justify-between self-stretch">
          <p className="typo-caption-2-medium text-label-info">
            {lastMessage.updatedAt && 'toDate' in lastMessage.updatedAt
              ? format(lastMessage.updatedAt.toDate(), 'MM-dd HH:mm')
              : ''}
          </p>
          {Number(chatChannel.unreadCount) > 0 && (
            <div className="bg-label-sub size-7 rounded-full flex items-center justify-center">
              <p className="text-white typo-caption-2-semibold">
                {Number(chatChannel.unreadCount)}
              </p>
            </div>
          )}
        </div>
      </div>
      <div className="absolute right-0 flex items-center justify-center h-full">
        <ActionButton className="bg-alternative" onClick={handlePinClick}>
          {chatChannel.isPinned ? (
            <PinOffIcon className="size-8 fill-label-info" />
          ) : (
            <PinIcon className="size-8 fill-label-info" />
          )}
        </ActionButton>
        <ActionButton className="bg-negative-light" onClick={handleDeleteClick}>
          <ChatTrashIcon className="size-7 fill-white" />
        </ActionButton>
      </div>
    </div>
  );
}
