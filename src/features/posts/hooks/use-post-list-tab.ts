import { useSearchParams } from 'next/navigation';

import { CONSULT_TYPE } from '@/entities/posts/constants/consult-type';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import type { ValueOf } from '@/shared/type/types';

import type { PostListTab } from '../types/post-list-tab';

export default function usePostListTab() {
  const router = useRouterWithUser();

  const searchParams = useSearchParams();

  const activePostListTab =
    (searchParams.get(SEARCH_PARAMS.POST_LIST_TAB) as PostListTab) ?? 'latest';
  const activePostTab =
    (searchParams.get(SEARCH_PARAMS.POST_TAB) as ValueOf<typeof CONSULT_TYPE>) ??
    CONSULT_TYPE.CONSULTING;

  const setActivePostListTab = (tab: PostListTab) => {
    router.replace(window.location.pathname, {
      [SEARCH_PARAMS.POST_LIST_TAB]: tab,
      [SEARCH_PARAMS.POST_TAB]: activePostTab,
    });
  };

  return [activePostListTab, setActivePostListTab] as const;
}
