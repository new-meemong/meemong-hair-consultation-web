import { useSearchParams } from 'next/navigation';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { ValueOf } from '@/shared/type/types';

import { POST_TAB_VALUE } from '../constants/post-tabs';

export function usePostTab() {
  const router = useRouterWithUser();

  const searchParams = useSearchParams();
  const activePostTab =
    (searchParams.get(SEARCH_PARAMS.POST_TAB) as ValueOf<typeof POST_TAB_VALUE>) ??
    POST_TAB_VALUE.CONSULTING;

  const setActivePostTab = (tab: ValueOf<typeof POST_TAB_VALUE>) => {
    router.replace({
      [SEARCH_PARAMS.POST_TAB]: tab,
    });
  };

  return [activePostTab, setActivePostTab] as const;
}
