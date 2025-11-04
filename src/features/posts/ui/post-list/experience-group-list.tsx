import type { ExperienceGroup } from '@/entities/posts/model/experience-group';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import type { PostListTab } from '../../types/post-list-tab';

import PostListEmptyView from './post-list-empty-view';
import PostListItem from './post-list-item';

type ExperienceGroupListProps = {
  experienceGroups: ExperienceGroup[];
  tab: PostListTab;
  fetchNextPage: () => void;
};

export default function ExperienceGroupList({
  experienceGroups,
  tab,
  fetchNextPage,
}: ExperienceGroupListProps) {
  const router = useRouterWithUser();

  const handlePostClick = (id: number) => {
    router.push(ROUTES.POSTS_EXPERIENCE_GROUP_DETAIL(id.toString()), {
      [SEARCH_PARAMS.POST_LIST_TAB]: tab,
    });
  };

  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
  });

  if (experienceGroups.length === 0) {
    return <PostListEmptyView tab={tab} />;
  }

  return (
    <>
      {experienceGroups.map(
        ({ id, updatedAt, title, viewCount, likeCount, commentCount, price, priceType }, index) => (
          <PostListItem
            key={id}
            id={id}
            updatedAt={updatedAt}
            title={title}
            viewCount={viewCount}
            likeCount={likeCount}
            commentCount={commentCount}
            onClick={() => handlePostClick(id)}
            ref={index === experienceGroups.length - 2 ? observerRef : undefined}
            isConsultingPost={false}
            price={price}
            priceType={priceType}
          />
        ),
      )}
    </>
  );
}
