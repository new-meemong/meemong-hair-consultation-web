import { useMemo } from 'react';

import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { MoreOptionsMenu } from '@/shared';

import useDeletePost from '../../hooks/use-delete-post';

type PostDetailMoreButtonProps = {
  postId: string;
};

export default function PostDetailMoreButton({ postId }: PostDetailMoreButtonProps) {
  const { handleDeletePost } = useDeletePost(postId);

  const moreOptions = useMemo(
    () => [
      {
        label: '삭제하기',
        onClick: handleDeletePost,
        className: 'text-negative',
      },
    ],
    [handleDeletePost],
  );

  return (
    <MoreOptionsMenu
      trigger={<MoreIcon className="size-7" />}
      options={moreOptions}
      contentClassName="-right-[14px] "
    />
  );
}
