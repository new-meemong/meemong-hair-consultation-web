import { MoreOptionsMenu } from '@/shared';
import { useMemo } from 'react';
import MoreIcon from '@/assets/icons/more-horizontal.svg';

export default function ChatDetailMoreButton() {
  const handleReport = () => {
    console.log('신고하기');
  };
  const handleLeave = () => {
    console.log('나가기');
  };
  const handleBlock = () => {
    console.log('차단하기');
  };

  const moreOptions = useMemo(
    () => [
      {
        label: '신고하기',
        onClick: handleReport,
      },
      {
        label: '나가기',
        onClick: handleLeave,
      },
      {
        label: '차단하기',
        onClick: handleBlock,
        className: 'text-negative',
      },
    ],
    [],
  );

  return (
    <MoreOptionsMenu
      trigger={<MoreIcon className="size-7" />}
      options={moreOptions}
      contentClassName="-right-[14px] "
    />
  );
}
