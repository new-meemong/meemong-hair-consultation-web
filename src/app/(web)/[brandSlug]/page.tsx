'use client';

import { decodeJWTPayload, getWebUserData } from '@/shared/lib/auth';
import { use, useEffect } from 'react';

import { ROUTES } from '@/shared/lib/routes';
import { WEB_USER_DATA_KEY } from '@/shared/constants/local-storage';
import { useRouter } from 'next/navigation';

export default function BrandRootPage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = use(params);
  const router = useRouter();

  useEffect(() => {
    const userData = getWebUserData(brandSlug);
    const token = userData?.token ?? null;

    if (token) {
      const payload = decodeJWTPayload(token);
      const isExpired = !payload || payload.exp * 1000 < Date.now();
      if (!isExpired) {
        router.replace(ROUTES.WEB_MY(brandSlug));
        return;
      }
      localStorage.removeItem(WEB_USER_DATA_KEY(brandSlug));
    }

    router.replace(ROUTES.WEB_WELCOME(brandSlug));
  }, [brandSlug, router]);

  return null;
}
