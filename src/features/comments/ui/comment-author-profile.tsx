import LockIcon from '@/assets/icons/lock.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import type { CommentUser } from '@/entities/comment/model/comment';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { useAuthContext } from '@/features/auth/context/auth-context';
import useSendMessage from '@/features/chat/hook/use-send-message';
import { useShowInvalidChatRequestSheet } from '@/features/chat/hook/use-show-invalid-chat-request-sheet';
import { useHairConsultationChatChannelStore } from '@/features/chat/store/hair-consultation-chat-channel-store';
import { HairConsultationChatMessageTypeEnum } from '@/features/chat/type/hair-consultation-chat-message-type';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';

type CommentAuthorProfileProps = {
  author: CommentUser;
  isSecret: boolean;
};

export default function CommentAuthorProfile({ author, isSecret }: CommentAuthorProfileProps) {
  const { user, isUserDesigner } = useAuthContext();

  const isWriter = user.id === author.userId;

  const { profileImageUrl, name } = author;

  const displayedName = isWriter ? `${name}(글쓴이)` : name;

  const isCommentAuthorDesigner = author.role === USER_ROLE.DESIGNER;

  const { findOrCreateChannel } = useHairConsultationChatChannelStore((state) => ({
    findOrCreateChannel: state.findOrCreateChannel,
  }));

  const showInvalidChatRequestBottomSheet = useShowInvalidChatRequestSheet();
  const sendMessage = useSendMessage();

  const handleClick = async () => {
    if (isUserDesigner) {
      showInvalidChatRequestBottomSheet();
      return;
    }

    if (!isCommentAuthorDesigner || isWriter) return;

    const senderId = user.id.toString();
    const receiverId = author.userId.toString();

    //TODO: 앱 프로필 페이지로 이동하여 채팅 요청해야함
    // goDesignerProfilePage(author.userId.toString());
    try {
      const { channelId, isCreated } = await findOrCreateChannel({
        senderId,
        receiverId,
      });

      if (!channelId) {
        console.error('채널 생성 중 오류가 발생했습니다.');
        return;
      }

      if (isCreated) {
        await sendMessage({
          channelId,
          message: `헤어상담 채팅이 시작되었습니다.`,
          messageType: HairConsultationChatMessageTypeEnum.SYSTEM,
          receiverId,
        });
      }
    } catch (error) {
      console.error('요청 실패:', error);
    }
  };

  return (
    <div
      className={cn('flex gap-2 items-center', isCommentAuthorDesigner && 'cursor-pointer')}
      onClick={handleClick}
    >
      <Avatar className="size-8">
        {profileImageUrl ? (
          <AvatarImage src={profileImageUrl} className="size-8 rounded-6" />
        ) : (
          <AvatarFallback>
            <ProfileIcon className="size-8 bg-label-info" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex items-center gap-1">
        <p
          className={cn(
            'typo-body-1-semibold',
            isWriter ? 'text-negative-light' : 'text-label-default',
          )}
        >
          {displayedName}
        </p>
        {isSecret && <LockIcon className="size-3.5 fill-label-placeholder" />}
      </div>
    </div>
  );
}
