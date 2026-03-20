'use client';

import { ROUTES } from '@/shared';
import { HairLengthSelectPage } from '@/features/posts/pages/hair-length-select-page';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { replace } = useRouterWithUser();
  const searchParams = useSearchParams();

  return (
    <HairLengthSelectPage
      onComplete={() => replace(ROUTES.POSTS_CREATE, { skipReload: '1' })}
      onBack={() =>
        replace(ROUTES.POSTS_CREATE, {
          skipReload: '1',
          ...Object.fromEntries(searchParams.entries()),
        })
      }
    />
  );
}
