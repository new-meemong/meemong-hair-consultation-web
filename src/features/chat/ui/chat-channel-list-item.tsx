import { useState, useEffect, useRef, type ReactNode } from 'react';

import Image from 'next/image';

import { format } from 'date-fns';

import ChatTrashIcon from '@/assets/icons/chat-trash.svg';
import PinOffIcon from '@/assets/icons/pin-off.svg';
import PinIcon from '@/assets/icons/pin.svg';

import { useAuthContext } from '@/features/auth/context/auth-context';
import { useHairConsultationChatChannelStore } from '@/features/chat/store/hair-consultation-chat-channel-store';
import type { UserHairConsultationChatChannelType } from '@/features/chat/type/user-hair-consultation-chat-channel-type';

import { cn } from '@/lib/utils';

import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { ROUTES } from '@/shared/lib/routes';

import useIsFromApp from '../hook/use-is-from-app';
import useLeaveChat from '../hook/use-leave-chat';

// Firestore에 저장된 실제 데이터 구조에 맞는 타입
interface FirestoreUser {
  DisplayName?: string;
  Email?: string;
  FcmToken?: string;
  Korean?: string;
  Role?: number;
  Sex?: string;
  profileUrl?: string;
  UserID?: string | null;
  id?: number;
  // 기존 User 타입의 필드들도 포함
  displayName?: string;
  profilePictureURL?: string;
}

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
  const router = useRouterWithUser();
  const isFromApp = useIsFromApp();

  const [offset, setOffset] = useState(0);
  const [startX, setStartX] = useState(0);
  const hasTriedUpdate = useRef(false);

  const { user } = useAuthContext();
  const userId = user.id;

  const { pinChannel, unpinChannel, updateChannelUserInfo } = useHairConsultationChatChannelStore(
    (state) => ({
      pinChannel: state.pinChannel,
      unpinChannel: state.unpinChannel,
      updateChannelUserInfo: state.updateChannelUserInfo,
    }),
  );

  // 사용자 정보가 없거나 불완전한 경우 업데이트 (한 번만 실행)
  useEffect(() => {
    if (
      !hasTriedUpdate.current &&
      (!chatChannel.otherUser || !(chatChannel.otherUser as FirestoreUser)?.DisplayName)
    ) {
      hasTriedUpdate.current = true;
      updateChannelUserInfo(chatChannel.channelId, userId.toString());
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [chatChannel.channelId, chatChannel.otherUserId, userId]);

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

    // if (!userId) return;

    if (window.openChatChannel && isFromApp) {
      window.openChatChannel({
        userId: userId.toString(),
        chatChannelId: chatChannel.channelId,
      });
      return;
    }

    // if (!source || source === SourceType.WEB) {
    router.push(ROUTES.CHAT_HAIR_CONSULTATION_DETAIL(chatChannel.channelId));
    // }
  };

  const handleLeaveChat = useLeaveChat();

  const handleDeleteClick = () => {
    handleLeaveChat(chatChannel, {
      onSuccess: () => {
        setOffset(0);
      },
    });
  };

  const { lastMessage, otherUser } = chatChannel;
  const userImage =
    (otherUser as FirestoreUser)?.profileUrl || otherUser?.profilePictureURL || '/profile.svg';

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
        <div className="flex flex-col gap-2 flex-1 overflow-hidden">
          <div className="flex items-center gap-0.5">
            {chatChannel.isPinned && <PinIcon className="size-4 fill-label-info" />}
            <p className="typo-headline-bold text-label-strong">
              {(otherUser as FirestoreUser)?.DisplayName || otherUser?.displayName || '알수없음'}
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
