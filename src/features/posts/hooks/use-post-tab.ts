import { useSearchParams } from 'next/navigation';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { ValueOf } from '@/shared/type/types';

export function usePostTab() {
  const router = useRouterWithUser();

  const searchParams = useSearchParams();
  const activePostTab =
    (searchParams.get(SEARCH_PARAMS.POST_TAB) as ValueOf<typeof CONSULT_TYPE>) ??
    CONSULT_TYPE.CONSULTING;

  const setActivePostTab = (tab: ValueOf<typeof CONSULT_TYPE>) => {
    router.replace(window.location.pathname, {
      [SEARCH_PARAMS.POST_TAB]: tab,
    });
  };

  return [activePostTab, setActivePostTab] as const;
}
