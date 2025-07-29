import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import ReplyIcon from '@/assets/icons/reply.svg';
import CommentAuthorProfile from './comment-author-profile';
import CommentIcon from '@/assets/icons/comment.svg';
import MoreIcon from '@/assets/icons/more-vertical.svg';
import { format } from 'date-fns';

type CommentListItemProps = {
  comment: CommentWithReplyStatus;
};

export default function CommentListItem({ comment }: CommentListItemProps) {
  const { isReply, content, isVisibleToModel, createdAt } = comment;

  return (
    <div className="flex gap-3 p-5">
      {isReply && <ReplyIcon className="size-4.5 fill-label-strong" />}
      <div className="flex flex-col gap-3 flex-1">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <CommentAuthorProfile author={comment.user} isSecret={isVisibleToModel} />
          </div>
          <div className="flex items-center gap-2">
            {!isReply && <CommentIcon className="size-5 fill-label-info" />}
            <MoreIcon className="size-6" />
          </div>
        </div>
        <div className="flex flex-col gap-2">
          <div className="typo-body-1-long-regular">{content}</div>
          <span className="typo-body-3-regular text-label-info">
            {format(createdAt, 'MM//dd hh:mm')}
          </span>
        </div>
      </div>
    </div>
  );
}
