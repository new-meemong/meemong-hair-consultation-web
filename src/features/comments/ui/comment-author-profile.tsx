import { Avatar, AvatarFallback, AvatarImage } from '@/shared';

import type { CommentUser } from '@/entities/comment/model/comment';
import LockIcon from '@/assets/icons/lock.svg';
import ProfileIcon from '@/assets/icons/profile.svg';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { cn } from '@/lib/utils';
import { getWebUserData } from '@/shared/lib/auth';
import { goDesignerProfilePage } from '@/shared/lib/go-designer-profile-page';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { useShowInvalidChatRequestSheet } from '@/features/chat/hook/use-show-invalid-chat-request-sheet';

type CommentAuthorProfileProps = {
  author: CommentUser;
  lockIconShown: boolean;
  postId?: string;
  answerId?: number;
  isConsultingAnswer?: boolean;
  isPostWriter?: boolean;
  allComments?: Array<{ user: CommentUser; answerId?: number; isConsultingAnswer?: boolean }>;
};

const NICKNAME_VISIBLE_LENGTH = 13;

const formatCommentNickname = (nickname: string) => {
  const chars = Array.from(nickname);

  if (chars.length <= NICKNAME_VISIBLE_LENGTH) {
    return nickname;
  }

  return `${chars.slice(0, NICKNAME_VISIBLE_LENGTH).join('')}...`;
};

export default function CommentAuthorProfile({
  author,
  lockIconShown,
  postId,
  answerId,
  isConsultingAnswer = false,
  isPostWriter = false,
  allComments = [],
}: CommentAuthorProfileProps) {
  const auth = useOptionalAuthContext();
  const brand = useOptionalBrand();
  const webUserId = brand ? (getWebUserData(brand.config.slug)?.userId ?? null) : null;
  const currentUserId = auth?.user?.id ?? webUserId;
  const isUserDesigner = auth?.isUserDesigner ?? false;

  const isWriter = currentUserId === author.userId;

  const { profilePictureURL, displayName } = author;

  const shouldHideConsultingAnswerAuthorName = isConsultingAnswer && isUserDesigner && !isWriter;
  const displayedName = shouldHideConsultingAnswerAuthorName
    ? '익명'
    : isWriter
      ? `${formatCommentNickname(displayName)}(글쓴이)`
      : formatCommentNickname(displayName);

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
      isMyHairConsultationPost: isPostWriter,
      isConsultingAnswerComment: isConsultingAnswer,
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
