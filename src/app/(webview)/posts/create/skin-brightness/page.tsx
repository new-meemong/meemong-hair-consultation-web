'use client';

import { ROUTES } from '@/shared';
import { SkinBrightnessSelectPage } from '@/features/posts/pages/skin-brightness-select-page';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';

export default function Page() {
  const { replace } = useRouterWithUser();
  const searchParams = useSearchParams();

  return (
    <SkinBrightnessSelectPage
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
