import type { ExperienceGroup } from '@/entities/posts/model/experience-group';
import { ROUTES } from '@/shared';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import useCreateExperienceGroupReadingMutation from '../../api/use-create-experience-group-reading-mutation';
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

  const { mutate: createExperienceGroupReadingMutation } =
    useCreateExperienceGroupReadingMutation();

  const handlePostClick = ({ id, isRead }: { id: number; isRead: boolean }) => {
    if (!isRead) {
      createExperienceGroupReadingMutation(id, { onSuccess: () => {} });
    }

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
        (
          { id, createdAt, title, viewCount, likeCount, commentCount, price, priceType, isRead },
          index,
        ) => (
          <PostListItem
            key={id}
            createdAt={createdAt}
            title={title}
            viewCount={viewCount}
            likeCount={likeCount}
            commentCount={commentCount}
            onClick={() => handlePostClick({ id, isRead })}
            ref={index === experienceGroups.length - 2 ? observerRef : undefined}
            isConsultingPost={false}
            price={price}
            priceType={priceType}
            isRead={isRead}
          />
        ),
      )}
    </>
  );
}
