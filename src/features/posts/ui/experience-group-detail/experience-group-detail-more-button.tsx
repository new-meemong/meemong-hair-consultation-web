import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { MoreOptionsMenu } from '@/shared/ui/more-options-menu';

type ExperienceGroupDetailMoreButtonProps = {
  experienceGroupId: string;
};

export default function ExperienceGroupDetailMoreButton({
  experienceGroupId,
}: ExperienceGroupDetailMoreButtonProps) {
  const handleDelete = () => {
    console.log('experienceGroupId', experienceGroupId);
  };

  const handleEdit = () => {};

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
