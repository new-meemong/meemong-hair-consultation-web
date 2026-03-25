'use client';

import { useEffect } from 'react';
import { usePathname, useRouter } from 'next/navigation';

import { AUTH_TOKEN_EXPIRED_EVENT } from '@/shared/api/client';
import { useOptionalBrand } from '@/shared/context/brand-context';
import { getWebUserData } from '@/shared/lib/auth';
import { ROUTES } from '@/shared/lib/routes';

const PUBLIC_PATH_SEGMENTS = ['/welcome', '/auth/', '/sample'];

function isPublicBrandPath(pathname: string, slug: string): boolean {
  const relativePath = pathname.slice(`/${slug}`.length);
  return relativePath === '' || PUBLIC_PATH_SEGMENTS.some((s) => relativePath.startsWith(s));
}

export default function WebSessionGuard() {
  const brand = useOptionalBrand();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    if (!brand) return;
    const { slug } = brand.config;
    if (isPublicBrandPath(pathname, slug)) return;

    const webToken = getWebUserData(slug)?.token;
    if (!webToken) {
      router.replace(ROUTES.WEB_WELCOME(slug));
    }
  }, [brand, pathname, router]);

  useEffect(() => {
    if (!brand) return;
    const { slug } = brand.config;

    const handleAuthExpired = () => {
      router.replace(ROUTES.WEB_WELCOME(slug));
    };

    window.addEventListener(AUTH_TOKEN_EXPIRED_EVENT, handleAuthExpired);
    return () => window.removeEventListener(AUTH_TOKEN_EXPIRED_EVENT, handleAuthExpired);
  }, [brand, router]);

  return null;
}
