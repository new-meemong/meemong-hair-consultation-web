import { useRef } from 'react';

import { useSearchParams } from 'next/navigation';

import { format } from 'date-fns';

import MoreIcon from '@/assets/icons/more-vertical.svg';
import ReplyIcon from '@/assets/icons/reply.svg';
import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { cn } from '@/lib/utils';
import { Button, MoreOptionsMenu, ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import CommentAuthorProfile from './comment-author-profile';
import CommentListItemSecret from './comment-list-item-secret';
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

  const { user, isUserDesigner } = useAuthContext();
  const { push } = useRouterWithUser();

  const handleConsultingResponseClick = () => {
    if (comment.answerId) {
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
        {isSecret ? (
          <CommentListItemSecret createdAt={createdAt} />
        ) : (
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
              {!isConsultingAnswer && <div className="typo-body-1-long-regular">{content}</div>}
              <span className="typo-body-3-regular text-label-info">
                {format(createdAt, 'MM/dd hh:mm')}
              </span>
              {isConsultingAnswer && !isReply && (
                <ConsultingResponseButton
                  isCommentWriter={isCommentWriter}
                  hasAnswerImages={comment.hasAnswerImages ?? false}
                  onClick={handleConsultingResponseClick}
                />
              )}
            </div>
          </div>
        )}
      </>
    </div>
  );
}
