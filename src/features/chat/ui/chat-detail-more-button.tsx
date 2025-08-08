import { MoreOptionsMenu, ROUTES } from '@/shared';
import { useCallback, useMemo } from 'react';
import MoreIcon from '@/assets/icons/more-horizontal.svg';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

type ChatDetailMoreButtonProps = {
  otherUserId: string;
};

export default function ChatDetailMoreButton({ otherUserId }: ChatDetailMoreButtonProps) {
  const router = useRouterWithUser();

  const handleReport = useCallback(() => {
    router.push(ROUTES.REPORT(otherUserId));
  }, [router, otherUserId]);

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
    [handleReport],
  );

  return (
    <MoreOptionsMenu
      trigger={<MoreIcon className="size-7" />}
      options={moreOptions}
      contentClassName="-right-[14px] "
    />
  );
}
