import LockIcon from '@/assets/icons/lock.svg';
import { format } from 'date-fns';

type CommentListItemSecretProps = {
  createdAt: string;
};

export default function CommentListItemSecret({ createdAt }: CommentListItemSecretProps) {
  return (
    <div className="flex items-center justify-between px-5 py-4 border-b-1 border-border-default">
      <div className="flex gap-1">
        <p className="typo-body-2-regular text-label-sub">비밀댓글입니다</p>
        <LockIcon className="size-3.5 fill-label-placeholder" />
      </div>
      <span className="typo-body-3-regular text-label-info">
        {format(createdAt, 'MM/dd hh:mm')}
      </span>
    </div>
  );
}
