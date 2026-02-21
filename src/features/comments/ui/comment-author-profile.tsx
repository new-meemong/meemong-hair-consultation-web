import { Avatar, AvatarFallback, AvatarImage } from '@/shared';

import type { CommentUser } from '@/entities/comment/model/comment';
import LockIcon from '@/assets/icons/lock.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { cn } from '@/lib/utils';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useShowInvalidChatRequestSheet } from '@/features/chat/hook/use-show-invalid-chat-request-sheet';

type CommentAuthorProfileProps = {
  author: CommentUser;
  lockIconShown: boolean;
  postId?: string;
  answerId?: number;
  isPostWriter?: boolean;
  allComments?: Array<{ user: CommentUser; answerId?: number; isConsultingAnswer?: boolean }>;
};

export default function CommentAuthorProfile({
  author,
  lockIconShown,
  postId,
  answerId,
  isPostWriter = false,
  allComments = [],
}: CommentAuthorProfileProps) {
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

    // 요구사항에 따른 postId, answerId 설정
    let finalPostId: string | undefined;
    let finalAnswerId: string | undefined;

    if (isPostWriter) {
      // 내 글인 경우
      finalPostId = postId;

      if (answerId) {
        // 컨설팅 댓글인 경우: 해당 컨설팅 답변 ID 전달
        finalAnswerId = answerId.toString();
      } else {
        // 일반 댓글인 경우: 해당 디자이너가 내 글에 작성한 컨설팅 답변 ID 찾기
        const designerConsultingAnswer = allComments.find(
          (comment) =>
            comment.user.userId === author.userId && comment.isConsultingAnswer && comment.answerId,
        );
        finalAnswerId = designerConsultingAnswer?.answerId?.toString() || undefined;
      }
    } else {
      // 다른 사람 글인 경우: postId, answerId 모두 null
      finalPostId = undefined;
      finalAnswerId = undefined;
    }

    // 댓글에서 프로필로 이동할 때 postId와 answerId 전달
    goDesignerProfilePage(author.userId.toString(), {
      postId: finalPostId,
      answerId: finalAnswerId,
      entrySource: 'POST_COMMENT',
    });
  };

  return (
    <div
      className={cn('flex gap-2 items-center min-w-0', isCommentAuthorDesigner && 'cursor-pointer')}
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
      <div className="flex items-center gap-1 min-w-0">
        <p
          className={cn(
            'typo-body-1-semibold truncate',
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
