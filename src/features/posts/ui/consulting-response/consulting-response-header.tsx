import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import { Avatar, AvatarFallback, AvatarImage, Button, ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

type ConsultingResponseHeaderProps = {
  postId: string;
};

export default function ConsultingResponseHeader({ postId }: ConsultingResponseHeaderProps) {
  const { push } = useRouterWithUser();
  const authorName = '익명';
  const createdAt = '03/31 09:00';
  const profileImageUrl = null;

  const handleDesignerProfileClick = () => {
    console.log('디자이너 프로필 보기');
  };
  const handleOriginalPostClick = () => {
    push(ROUTES.POSTS_DETAIL(postId));
  };

  return (
    <div className="flex flex-col px-5 py-8 bg-label-default gap-8">
      <div className="flex flex-col gap-4">
        <Avatar className="size-12 rounded-full overflow-hidden">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} className="size-12 rounded-full" />
          ) : (
            <AvatarFallback>
              <ProfileIcon className="size-12 bg-label-info" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-2">
          <p className="typo-title-3-bold text-white whitespace-pre-line">
            {`${authorName} 디자이너님이 보낸\n컨설팅 답변입니다`}
          </p>
          <p className="typo-body-3-regular text-label-placeholder">{`${createdAt} 작성`}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">
        <Button
          theme="whiteBorder"
          className="flex gap-2 items-center"
          onClick={handleDesignerProfileClick}
        >
          디자이너 프로필 보기
          <ChevronRightIcon className="size-5 fill-white" />
        </Button>
        <Button theme="whiteBorder" onClick={handleOriginalPostClick}>
          원글 보기
        </Button>
      </div>
    </div>
  );
}
