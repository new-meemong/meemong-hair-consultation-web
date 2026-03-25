'use client';

import { useEffect, useState } from 'react';

import { getWebUserData } from '@/shared/lib/auth';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import { useOptionalBrand } from '@/shared/context/brand-context';

export function useSex(): '남자' | '여자' | undefined {
  const auth = useOptionalAuthContext();
  const slug = useOptionalBrand()?.config.slug;
  const [webSex, setWebSex] = useState<'남자' | '여자' | undefined>(undefined);

  useEffect(() => {
    if (!slug) return;
    const data = getWebUserData(slug);
    setWebSex(data?.sex ?? undefined);
  }, [slug]);

  return (auth?.user?.sex as '남자' | '여자' | undefined) ?? webSex;
}
