import ProfileIcon from '@/assets/icons/profile.svg';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared';
import { useCallback } from 'react';

type PostDetailAuthorProfileProps = {
  imageUrl: string | null;
  name: string;
  region: string | null;
  createdAt: string;
};

export default function PostDetailAuthorProfile({
  imageUrl,
  name,
  region,
  createdAt,
}: PostDetailAuthorProfileProps) {
  const { isUserDesigner } = useAuthContext();

  const shouldShowRegion = isUserDesigner && region;

  const handleClick = useCallback(
    () => {},
    [
      //TODO: 작성자가 모델일 때 '채팅은 모델만 요청할 수 있어요' 바텀시트 추가
    ],
  );

  console.log(handleClick);

  return (
    <div className="flex items-center gap-2">
      <Avatar>
        {imageUrl ? (
          <AvatarImage src={imageUrl} className="w-12 h-12 rounded-6" />
        ) : (
          <AvatarFallback>
            <ProfileIcon className="size-12 bg-label-default" />
          </AvatarFallback>
        )}
      </Avatar>
      <div className="flex flex-col">
        <p className="typo-body-1-semibold text-label-default">{name}</p>
        <p className="typo-body-3-regular text-label-info">
          {shouldShowRegion ? `${region} | ` : ''}
          {createdAt}
        </p>
      </div>
    </div>
  );
}
