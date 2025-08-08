import { useCallback, useMemo } from 'react';

import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { MoreOptionsMenu, ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import useDeletePost from '../../hooks/use-delete-post';



type PostDetailMoreButtonProps = {
  postId: string;
};

export default function PostDetailMoreButton({ postId }: PostDetailMoreButtonProps) {
  const { push } = useRouterWithUser();

  const handleEdit = useCallback(() => {
    if (!postId) return;

    push(ROUTES.POSTS_EDIT(postId));
  }, [postId, push]);

  const { handleDeletePost } = useDeletePost(postId);

  const moreOptions = useMemo(
    () => [
      {
        label: '수정하기',
        onClick: handleEdit,
      },
      {
        label: '삭제하기',
        onClick: handleDeletePost,
        className: 'text-negative',
      },
    ],
    [handleEdit, handleDeletePost],
  );

  return (
    <MoreOptionsMenu
      trigger={<MoreIcon className="size-7" />}
      options={moreOptions}
      contentClassName="-right-[14px] "
    />
  );
}
