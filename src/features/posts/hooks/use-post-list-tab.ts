import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';
import type { PostListTab } from '../types/post-list-tab';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import type { ValueOf } from '@/shared/type/types';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { useSearchParams } from 'next/navigation';

export default function usePostListTab() {
  const router = useRouterWithUser();

  const searchParams = useSearchParams();

  const activePostListTab =
    (searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) as PostListTab) ?? 'latest';
  const activePostTab =
    (searchParams.get(SEARCH_PARAMS.POST_TAB) as ValueOf<typeof CONSULT_TYPE>) ??
    CONSULT_TYPE.CONSULTING;
  const activeBrandId = searchParams.get(SEARCH_PARAMS.BRAND_ID);

  const setActivePostListTab = (tab: PostListTab) => {
    const nextParams: Record<string, string> = {
      [SEARCH_PARAMS.POST_LIST_TAB]: tab,
      [SEARCH_PARAMS.POST_TAB]: activePostTab,
    };

    if (activeBrandId) {
      nextParams[SEARCH_PARAMS.BRAND_ID] = activeBrandId;
    }

    router.replace(window.location.pathname, nextParams);
  };

  return [activePostListTab, setActivePostListTab] as const;
}
