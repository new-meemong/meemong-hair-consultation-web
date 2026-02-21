import { Button, MoreOptionsMenu, ROUTES } from '@/shared';

import { AD_TYPE } from '@/features/ad/constants/ad-type';
import CommentAuthorProfile from './comment-author-profile';
import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import ConsultingResponseButton from './consulting-response-button';
import MoreIcon from '@/assets/icons/more-vertical.svg';
import ReplyIcon from '@/assets/icons/reply.svg';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { USER_SEX } from '@/entities/user/constants/user-sex';
import type { ValueOf } from '@/shared/type/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { showAdIfAllowed } from '@/shared/lib/show-ad-if-allowed';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { useRef } from 'react';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';
import useShowMongConsumeSheet from '@/features/mong/hook/use-show-mong-consume-sheet';

const MORE_ACTION = {
  EDIT: 'edit',
  DELETE: 'delete',
  REPORT: 'report',
} as const;

type CommentListItemProps = {
  comment: CommentWithReplyStatus;
  postId: string;
  postSource?: 'new' | 'legacy';
  postWriterId: number;
  postWriterSex?: ValueOf<typeof USER_SEX>;
  onReplyClick: (commentId: number) => void;
  isFocused: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onReport: () => void;
  onTriggerClick: () => void;
  allComments?: CommentWithReplyStatus[];
};

export default function CommentListItem({
  comment,
  postId,
  postSource = 'legacy',
  postWriterId,
  postWriterSex,
  onReplyClick,
  isFocused,
  onDelete,
  onEdit,
  onReport,
  onTriggerClick,
  allComments = [],
}: CommentListItemProps) {
  const searchParams = useSearchParams();
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';

  const { user, isUserDesigner, isUserModel } = useAuthContext();
  const { push } = useRouterWithUser();
  const showMongConsumeSheet = useShowMongConsumeSheet();
  const consultingResponsePath = comment.answerId
    ? postSource === 'new'
      ? ROUTES.POSTS_NEW_CONSULTING_RESPONSE(postId, comment.answerId.toString())
      : ROUTES.POSTS_CONSULTING_RESPONSE(postId, comment.answerId.toString())
    : null;
  const responseNavigationParams = {
    [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
    ...(postWriterSex ? { [SEARCH_PARAMS.POST_WRITER_SEX]: postWriterSex } : {}),
  };

  const handleConsultingResponseClick = async () => {
    if (comment.answerId && consultingResponsePath) {
      if (isUserModel) {
        // 내가 작성한 글의 컨설팅 답변을 볼 때만 몽 차감 결제 로직 적용
        if (isPostWriter) {
          // 모델인 경우 결제 이력 확인
          const result = await showMongConsumeSheet({
            designerName: comment.user.displayName,
            answerId: comment.answerId,
            postId,
            postListTab,
            postSource,
            postWriterSex,
          });
          // 결제 관련 이동/표시는 showMongConsumeSheet 내부에서 처리
          void result;
          return;
        } else {
          // 다른 사람 글의 컨설팅 답변을 볼 때는 구글 애드몹 광고 표시
          showAdIfAllowed({ adType: AD_TYPE.VIEW_HAIR_CONSULTING_ANSWER });
          push(consultingResponsePath, responseNavigationParams);
          return;
        }
      }
      // 디자이너인 경우 바로 답변 페이지로 이동
      push(consultingResponsePath, responseNavigationParams);
    }
  };

  const {
    isReply,
    content,
    isVisibleToModel,
    createdAt,
    user: author,
    isConsultingAnswer,
  } = comment;

  const isPostWriter = postWriterId === user.id;
  const isCommentWriter = author.userId === user.id;

  const replyCommentRef = useRef<HTMLDivElement>(null);

  const handleReplyClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onReplyClick(comment.id);
    if (replyCommentRef.current) {
      replyCommentRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const moreOption = {
    [MORE_ACTION.EDIT]: {
      label: '수정하기',
      onClick: onEdit,
    },
    [MORE_ACTION.DELETE]: {
      label: '삭제하기',
      onClick: onDelete,
      className: 'text-negative',
    },
    [MORE_ACTION.REPORT]: {
      label: '신고하기',
      onClick: onReport,
    },
  };

  const getMoreOptions = () => {
    if (isCommentWriter) {
      return isConsultingAnswer
        ? [moreOption[MORE_ACTION.DELETE]]
        : [moreOption[MORE_ACTION.EDIT], moreOption[MORE_ACTION.DELETE]];
    }
    return [moreOption[MORE_ACTION.REPORT]];
  };

  const isOtherDesignerGeneralCommentInNewPost =
    postSource === 'new' &&
    isUserDesigner &&
    !isPostWriter &&
    !isCommentWriter &&
    !isConsultingAnswer &&
    author.role === USER_ROLE.DESIGNER;
  const isSecret =
    isOtherDesignerGeneralCommentInNewPost ||
    (isUserDesigner &&
      !isPostWriter &&
      !isCommentWriter &&
      !isConsultingAnswer &&
      isVisibleToModel);
  const lockIconShown =
    isOtherDesignerGeneralCommentInNewPost ||
    (isUserDesigner && !isConsultingAnswer && isVisibleToModel);

  return (
    <div
      className={cn(
        'flex gap-3 p-5 border-b-1 border-border-default',
        isReply && 'bg-alternative',
        isFocused && 'bg-focused',
        isSecret && 'py-4',
      )}
      ref={replyCommentRef}
    >
      <>
        {isReply && <ReplyIcon className="size-4.5 fill-label-strong" />}
        <div className="flex flex-col gap-3 flex-1">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <CommentAuthorProfile
                author={comment.user}
                lockIconShown={lockIconShown}
                postId={postId}
                answerId={comment.answerId}
                isPostWriter={isPostWriter}
                allComments={allComments}
              />
            </div>
            <div className="flex items-center gap-1.5 shrink-0">
              {!isReply && !isConsultingAnswer && (
                <Button variant="text" theme="text" size="text" onClick={handleReplyClick}>
                  답글달기
                </Button>
              )}
              <MoreOptionsMenu
                trigger={<MoreIcon className="size-6" />}
                options={getMoreOptions()}
                contentClassName="-right-[14px] "
                onOpenChange={(open) => {
                  if (open) {
                    onTriggerClick();
                  }
                }}
              />
            </div>
          </div>
          <div className="flex flex-col gap-2">
            {isSecret ? (
              <span
                className={cn(
                  'typo-body-1-long-regular',
                  isReply ? 'text-label-info' : 'text-label-placeholder',
                )}
              >
                타 디자이너의 댓글은 볼 수 없습니다
              </span>
            ) : !isConsultingAnswer ? (
              <div className="typo-body-1-long-regular">{content}</div>
            ) : (
              <ConsultingResponseButton
                isCommentWriter={isCommentWriter}
                isFemalePostWriter={postWriterSex === USER_SEX.FEMALE}
                hasAnswerImages={comment.hasAnswerImages ?? false}
                analysisFaceShape={comment.analysisFaceShape}
                analysisBangs={comment.analysisBangs}
                analysisHairLength={comment.analysisHairLength}
                analysisHairLayer={comment.analysisHairLayer}
                analysisHairCurl={comment.analysisHairCurl}
                recommendedTreatment={comment.recommendedTreatment ?? comment.content}
                onClick={handleConsultingResponseClick}
              />
            )}
            <span className="typo-body-3-regular text-label-info">
              {format(createdAt, 'MM/dd hh:mm')}
            </span>
          </div>
        </div>
      </>
    </div>
  );
}
