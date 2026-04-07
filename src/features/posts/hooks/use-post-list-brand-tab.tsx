import { useCallback } from 'react';
import { useSearchParams } from 'next/navigation';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { ValueOf } from '@/shared/type/types';

import type { PostListTab } from '../types/post-list-tab';

export default function usePostListBrandTab(activePostListTab: PostListTab) {
  const auth = useOptionalAuthContext();
  const router = useRouterWithUser();
  const searchParams = useSearchParams();

  const brand = auth?.isUserDesigner ? (auth.user.brand ?? null) : null;
  const activePostTab =
    (searchParams.get(SEARCH_PARAMS.POST_TAB) as ValueOf<typeof CONSULT_TYPE>) ??
    CONSULT_TYPE.CONSULTING;
  const selectedBrandId = brand && searchParams.get(SEARCH_PARAMS.BRAND_ID) === String(brand.id)
    ? brand.id
    : null;

  const onPressedChange = useCallback(() => {
    if (!brand) return;

    const nextParams: Record<string, string> = {
      [SEARCH_PARAMS.POST_TAB]: activePostTab,
      [SEARCH_PARAMS.POST_LIST_TAB]: activePostListTab,
    };

    if (selectedBrandId === null) {
      nextParams[SEARCH_PARAMS.BRAND_ID] = String(brand.id);
    }

    router.replace(window.location.pathname, nextParams);
  }, [activePostListTab, activePostTab, brand, router, selectedBrandId]);

  const brandTab = brand
    ? {
        id: 'brand',
        label: brand.name,
        pressed: selectedBrandId === brand.id,
        onPressedChange,
      }
    : null;

  return { brandTab, selectedBrandId };
}
