import CommentIcon from '@/assets/icons/comment.svg';
import MoreIcon from '@/assets/icons/more-vertical.svg';
import ReplyIcon from '@/assets/icons/reply.svg';
import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import CommentAuthorProfile from './comment-author-profile';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { MoreOptionsMenu, ROUTES } from '@/shared';
import CommentListItemSecret from './comment-list-item-secret';
import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

const MORE_ACTION = {
  EDIT: 'edit',
  DELETE: 'delete',
  REPORT: 'report',
} as const;

type CommentListItemProps = {
  comment: CommentWithReplyStatus;
  onReplyClick: (commentId: number) => void;
  isFocused: boolean;
  onDelete: () => void;
  onEdit: () => void;
  onReport: () => void;
  onTriggerClick: () => void;
};

export default function CommentListItem({
  comment,
  onReplyClick,
  isFocused,
  onDelete,
  onEdit,
  onReport,
  onTriggerClick,
}: CommentListItemProps) {
  const { user } = useAuthContext();
  const { push } = useRouterWithUser();

  const { isReply, content, isVisibleToModel, createdAt, user: author } = comment;

  const isWriter = author.userId === user?.id;

  const handleClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.stopPropagation();
    onReplyClick(comment.id);
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
    if (isWriter) {
      return [moreOption[MORE_ACTION.EDIT], moreOption[MORE_ACTION.DELETE]];
    }
    return [moreOption[MORE_ACTION.REPORT]];
  };

  const isSecret = !isWriter && isVisibleToModel;

  // TODO: 추후 컨설팅 댓글 여부 확인 로직 추가
  const isConsultingResult = true;
  const designerShopName = '주노헤어';
  const consultingResultContent = `${designerShopName} ${author.name}디자이너님이 컨설팅 답변을 보냈습니다! 버튼을 눌러 확인해보세요`;

  const handleConsultingResponseClick = () => {
    push(ROUTES.POSTS_CONSULTING_RESPONSE(comment.id.toString()));
  };

  return (
    <div
      className={cn(
        'flex gap-3 p-5 border-b-1 border-border-default',
        isReply && 'bg-alternative',
        isFocused && 'bg-focused',
        isSecret && 'py-4',
      )}
    >
      <>
        {isReply && <ReplyIcon className="size-4.5 fill-label-strong" />}
        {isSecret ? (
          <CommentListItemSecret createdAt={createdAt} />
        ) : (
          <div className="flex flex-col gap-3 flex-1">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <CommentAuthorProfile author={comment.user} isSecret={isVisibleToModel} />
              </div>
              <div className="flex items-center gap-2">
                {!isReply && (
                  <button onClick={(e) => handleClick(e)}>
                    <CommentIcon className="size-5 fill-label-info" />
                  </button>
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
              <div className="typo-body-1-long-regular">
                {isConsultingResult ? consultingResultContent : content}
              </div>
              <span className="typo-body-3-regular text-label-info">
                {format(createdAt, 'MM/dd hh:mm')}
              </span>
              {isConsultingResult && !isReply && (
                <button
                  type="button"
                  className="w-full mt-1 py-3 px-4 flex items-center justify-between rounded-6 border-1 border-border-default typo-body-1-medium text-label-default"
                  onClick={handleConsultingResponseClick}
                >
                  컨설팅 결과 보러가기
                  <ChevronRightIcon className="size-5 fill-label-info" />
                </button>
              )}
            </div>
          </div>
        )}
      </>
    </div>
  );
}
