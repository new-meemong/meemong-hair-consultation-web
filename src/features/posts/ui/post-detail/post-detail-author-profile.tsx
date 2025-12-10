import ProfileIcon from '@/assets/icons/profile.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import formatAddress from '@/features/auth/lib/format-address';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared';
import { useShowInvalidChatRequestSheet } from '@/features/chat/hook/use-show-invalid-chat-request-sheet';
import goModelProfilePage from '@/shared/lib/go-model-profile-page';
import { cn } from '@/lib/utils';

type PostDetailAuthorProfileProps = {
  imageUrl: string | null;
  name: string;
  region: string | null;
  createdAt: string;
  authorId: number;
};

export default function PostDetailAuthorProfile({
  imageUrl,
  name,
  region,
  createdAt,
  authorId,
}: PostDetailAuthorProfileProps) {
  const { user, isUserDesigner } = useAuthContext();
  const showInvalidChatRequestBottomSheet = useShowInvalidChatRequestSheet();

  const shouldShowRegion = isUserDesigner && region;
  const isWriter = user.id === authorId;

  const handleClick = () => {
    if (isWriter) return;

    if (isUserDesigner) {
      showInvalidChatRequestBottomSheet();
      return;
    }

    goModelProfilePage(authorId.toString());
  };

  return (
    <div
      className={cn('flex items-center gap-2', !isWriter && 'cursor-pointer')}
      onClick={handleClick}
    >
      <Avatar>
        {imageUrl ? (
          <AvatarImage src={imageUrl} className="size-10 rounded-6" />
        ) : (
          <AvatarFallback>
            <ProfileIcon className="size-10 bg-label-default" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <p className="typo-body-1-semibold text-label-default">{name}</p>
        <p className="typo-body-3-regular text-label-info">
          {shouldShowRegion ? `${formatAddress(region)} | ` : ''}
          {createdAt}
        </p>
      </div>
    </div>
  );
}
