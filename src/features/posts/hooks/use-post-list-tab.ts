import { useSearchParams } from 'next/navigation';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import type { PostListTab } from '../types/post-list-tab';

export default function usePostListTab() {
  const router = useRouterWithUser();

  const searchParams = useSearchParams();

  const activePostListTab =
    (searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) as PostListTab) ?? 'latest';

  console.log(
    'searchParams.get(SEARCH_PARAMS.POST_LIST_TAB)',
    searchParams.get(SEARCH_PARAMS.POST_LIST_TAB),
  );

  const setActivePostListTab = (tab: PostListTab) => {
    router.replace(window.location.pathname, {
      [SEARCH_PARAMS.POST_LIST_TAB]: tab,
    });
  };

  return [activePostListTab, setActivePostListTab] as const;
}
