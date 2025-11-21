import { useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import { format } from 'date-fns';

import MoreIcon from '@/assets/icons/more-vertical.svg';
import ReplyIcon from '@/assets/icons/reply.svg';

import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';

import { useAuthContext } from '@/features/auth/context/auth-context';
import useShowMongConsumeSheet from '@/features/mong/hook/use-show-mong-consume-sheet';

import { cn } from '@/lib/utils';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import { Button, MoreOptionsMenu, ROUTES } from '@/shared';

import CommentAuthorProfile from './comment-author-profile';
import ConsultingResponseButton from './consulting-response-button';

const MORE_ACTION = {
  EDIT: 'edit',
  DELETE: 'delete',
  REPORT: 'report',
} as const;

type CommentListItemProps = {
  comment: CommentWithReplyStatus;
  postId: string;
  postWriterId: number;
  onReplyClick: (commentId: number) => void;
  isFocused: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onReport: () => void;
  onTriggerClick: () => void;
};

export default function CommentListItem({
  comment,
  postId,
  postWriterId,
  onReplyClick,
  isFocused,
  onDelete,
  onEdit,
  onReport,
  onTriggerClick,
}: CommentListItemProps) {
  const searchParams = useSearchParams();
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';

  const { user, isUserDesigner, isUserModel } = useAuthContext();
  const { push } = useRouterWithUser();
  const showMongConsumeSheet = useShowMongConsumeSheet();

  const handleConsultingResponseClick = async () => {
    if (comment.answerId) {
      if (isUserModel) {
        // 모델인 경우 결제 이력 확인
        const result = await showMongConsumeSheet({
          designerName: comment.user.displayName,
          answerId: comment.answerId,
          postId,
          postListTab,
        });
        // 결제 이력이 있으면 바로 답변 페이지로 이동
        if (result?.alreadyPaid) {
          push(ROUTES.POSTS_CONSULTING_RESPONSE(postId, comment.answerId.toString()), {
            [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
          });
        }
        // 결제 이력이 없으면 바텀시트가 표시됨 (버튼 클릭 동작은 아직 연결하지 않음)
        return;
      }
      // 디자이너인 경우 바로 답변 페이지로 이동
      push(ROUTES.POSTS_CONSULTING_RESPONSE(postId, comment.answerId.toString()), {
        [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
      });
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

  const isSecret =
    isUserDesigner && !isPostWriter && !isCommentWriter && !isConsultingAnswer && isVisibleToModel;
  const lockIconShown = isUserDesigner && !isConsultingAnswer && isVisibleToModel;

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
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <CommentAuthorProfile author={comment.user} lockIconShown={lockIconShown} />
            </div>
            <div className="flex items-center gap-1.5">
              {!isReply && (
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
              <span className="typo-body-1-long-regular text-label-info">
                {`타 디자이너의 ${isReply ? '답글' : '댓글'}은 볼 수 없습니다`}
              </span>
            ) : !isConsultingAnswer ? (
              <div className="typo-body-1-long-regular">{content}</div>
            ) : (
              <ConsultingResponseButton
                isCommentWriter={isCommentWriter}
                hasAnswerImages={comment.hasAnswerImages ?? false}
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
