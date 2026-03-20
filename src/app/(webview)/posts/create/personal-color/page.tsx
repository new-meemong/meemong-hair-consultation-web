'use client';

import { ROUTES } from '@/shared';
import { PersonalColorSelectPage } from '@/features/posts/pages/personal-color-select-page';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { replace } = useRouterWithUser();
  const searchParams = useSearchParams();

  return (
    <PersonalColorSelectPage
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
