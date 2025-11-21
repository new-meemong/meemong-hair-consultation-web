import { useCallback, useMemo } from 'react';

import MoreIcon from '@/assets/icons/more-horizontal.svg';

import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import { MoreOptionsMenu, ROUTES } from '@/shared';

import useDeletePost from '../../hooks/use-delete-post';

type PostDetailMoreButtonProps = {
  postId: string;
  isConsultingPost: boolean;
};

export default function PostDetailMoreButton({
  postId,
  isConsultingPost,
}: PostDetailMoreButtonProps) {
  const { push } = useRouterWithUser();

  const handleEdit = useCallback(() => {
    if (!postId) return;

    push(ROUTES.POSTS_EDIT(postId));
  }, [postId, push]);

  const { handleDeletePost } = useDeletePost(postId);

  const moreOptions = useMemo(() => {
    const baseOptions = [
      {
        label: '삭제하기',
        onClick: handleDeletePost,
        className: 'text-negative',
      },
    ];

    if (!isConsultingPost) {
      return [
        {
          label: '수정하기',
          onClick: handleEdit,
        },
        ...baseOptions,
      ];
    }

    return baseOptions;
  }, [isConsultingPost, handleEdit, handleDeletePost]);

  return (
    <MoreOptionsMenu
      trigger={<MoreIcon className="size-7" />}
      options={moreOptions}
      contentClassName="-right-[14px] "
    />
  );
}
