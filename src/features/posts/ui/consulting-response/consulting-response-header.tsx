import { Avatar, AvatarFallback, AvatarImage, Button, ROUTES } from '@/shared';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import type { ConsultingResponseDesigner } from '@/entities/posts/model/consulting-response';
import ProfileIcon from '@/assets/icons/profile.svg';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { format } from 'date-fns';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';
import useStartChat from '@/features/chat/hook/use-start-chat';

type ConsultingResponseHeaderProps = {
  postId: string;
  author: ConsultingResponseDesigner;
  createdAt: string;
  responseId: string;
  hairConsultPostingCreateUserId: number;
};

export default function ConsultingResponseHeader({
  postId,
  author,
  createdAt,
  responseId,
  hairConsultPostingCreateUserId,
}: ConsultingResponseHeaderProps) {
  const searchParams = useSearchParams();
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';

  const { push } = useRouterWithUser();
  const { user } = useAuthContext();
  const { startChat } = useStartChat();
  const { id, name, profileImageUrl } = author;

  const isResponseWriter = user.id === id;
  const isPostWriter = user.id === hairConsultPostingCreateUserId;

  const handleEditClick = () => {
    push(ROUTES.POSTS_CONSULTING_RESPONSE_EDIT(postId, responseId));
  };

  const handleDesignerProfileClick = () => {
    goDesignerProfilePage(id.toString());
  };

  const handleOriginalPostClick = () => {
    push(ROUTES.POSTS_DETAIL(postId), {
      [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
    });
  };

  const handleChatClick = async () => {
    // 요구사항에 따른 postId, answerId 설정
    // 내 글인 경우: postId, answerId 전달
    // 다른 사람 글인 경우: postId, answerId 모두 null
    const finalPostId = isPostWriter ? postId : undefined;
    const finalAnswerId = isPostWriter ? responseId : undefined;

    await startChat({
      receiverId: id,
      postId: finalPostId,
      answerId: finalAnswerId,
      entrySource: 'CONSULTING_RESPONSE',
    });
  };

  return (
    <div className="flex flex-col px-5 py-8 bg-label-default gap-8">
      <div className="flex flex-col gap-4">
        <Avatar className="size-12 rounded-full overflow-hidden items-center justify-center">
          {profileImageUrl ? (
            <AvatarImage src={profileImageUrl} className="size-12 rounded-full" />
          ) : (
            <AvatarFallback>
              <ProfileIcon className="size-12 bg-label-info" />
            </AvatarFallback>
          )}
        </Avatar>
        <div className="flex flex-col gap-2">
          <p className="typo-title-3-semibold text-white whitespace-pre-line">
            {`${name} 디자이너가 보낸\n컨설팅 답변입니다`}
          </p>
          <p className="typo-body-2-regular text-label-placeholder">{`${format(createdAt, 'MM/dd hh:mm')} 작성`}</p>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {isResponseWriter ? (
          <Button theme="whiteBorder" onClick={handleEditClick}>
            수정하기
          </Button>
        ) : (
          <>
            <Button theme="whiteBorder" onClick={handleChatClick}>
              채팅하기
            </Button>
            <Button
              theme="whiteBorder"
              className="flex gap-2 items-center"
              onClick={handleDesignerProfileClick}
            >
              디자이너 프로필 보기
              <ChevronRightIcon className="size-5 fill-white" />
            </Button>
            {isPostWriter && (
              <Button theme="whiteBorder" onClick={handleOriginalPostClick}>
                원글 보기
              </Button>
            )}
          </>
        )}
      </div>
    </div>
  );
}
