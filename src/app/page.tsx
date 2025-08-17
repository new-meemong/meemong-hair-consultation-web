'use client';

import { useEffect } from 'react';

import { ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

export default function Home() {
  const { replace } = useRouterWithUser();

  useEffect(() => {
    replace(ROUTES.POSTS);
  }, [replace]);
}
