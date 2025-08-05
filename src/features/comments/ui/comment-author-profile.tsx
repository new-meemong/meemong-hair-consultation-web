import ProfileIcon from '@/assets/icons/profile.svg';
import type { CommentUser } from '@/entities/comment/model/comment';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared';
import LockIcon from '@/assets/icons/lock.svg';

type CommentAuthorProfileProps = {
  author: CommentUser;
  isSecret: boolean;
};

export default function CommentAuthorProfile({ author, isSecret }: CommentAuthorProfileProps) {
  const { user } = useAuthContext();

  const isWriter = user.id === author.userId;

  const { profileImageUrl, name } = author;

  const displayedName = isWriter ? `${name}(글쓴이)` : name;

  return (
    <div className="flex gap-2 items-center">
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
