import LockIcon from '@/assets/icons/lock.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import type { CommentUser } from '@/entities/comment/model/comment';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useShowInvalidChatRequestSheet } from '@/features/chat/hook/use-show-invalid-chat-request-sheet';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';

type CommentAuthorProfileProps = {
  author: CommentUser;
  lockIconShown: boolean;
};

export default function CommentAuthorProfile({ author, lockIconShown }: CommentAuthorProfileProps) {
  const { user, isUserDesigner } = useAuthContext();

  const isWriter = user.id === author.userId;

  const { profilePictureURL, displayName } = author;

  const displayedName = isWriter ? `${displayName}(글쓴이)` : displayName;

  const isCommentAuthorDesigner = author.role === USER_ROLE.DESIGNER;

  const showInvalidChatRequestBottomSheet = useShowInvalidChatRequestSheet();

  const handleClick = async () => {
    if (isWriter) return;

    if (isUserDesigner) {
      showInvalidChatRequestBottomSheet();
      return;
    }

    if (!isCommentAuthorDesigner) return;

    goDesignerProfilePage(author.userId.toString());
  };

  return (
    <div
      className={cn('flex gap-2 items-center', isCommentAuthorDesigner && 'cursor-pointer')}
      onClick={handleClick}
    >
      <Avatar className="size-8">
        {profilePictureURL ? (
          <AvatarImage src={profilePictureURL} className="size-8 rounded-6" />
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
          {displayedName ?? '익명'}
        </p>
        {lockIconShown && <LockIcon className="size-3.5 fill-label-placeholder" />}
      </div>
    </div>
  );
}
