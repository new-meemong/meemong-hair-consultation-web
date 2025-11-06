import { useSearchParams } from 'next/navigation';

import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { MoreOptionsMenu } from '@/shared/ui/more-options-menu';

type ExperienceGroupDetailMoreButtonProps = {
  experienceGroupId: string;
};

export default function ExperienceGroupDetailMoreButton({
  experienceGroupId,
}: ExperienceGroupDetailMoreButtonProps) {
  const searchParams = useSearchParams();
  const postListTab = searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) ?? 'latest';

  const { push } = useRouterWithUser();

  const handleDelete = () => {
    console.log('experienceGroupId', experienceGroupId);
  };

  const handleEdit = () => {
    push(ROUTES.POSTS_EXPERIENCE_GROUP_EDIT(experienceGroupId), {
      [SEARCH_PARAMS.POST_LIST_TAB]: postListTab,
    });
  };

  const moreOptions = [
    {
      label: '삭제하기',
      onClick: handleDelete,
      className: 'text-negative',
    },
    {
      label: '수정하기',
      onClick: handleEdit,
    },
  ];

  return (
    <MoreOptionsMenu
      trigger={<MoreIcon className="size-7" />}
      options={moreOptions}
      contentClassName="-right-[14px] "
    />
  );
}
