'use client';

import { type Post } from '@/entities/posts';
import { type PostListTab } from '@/features/posts/types/post-list-tab';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { ROUTES } from '@/shared/lib/routes';

import PostListEmptyView from './post-list-empty-view';
import PostListItem from './post-list-item';
import useCreateHairConsultationReadingMutation from '../../api/use-create-hair-consultation-reading-mutation';
import useCreatePostReadingMutation from '../../api/use-create-post-reading-mutation';

type PostListProps = {
  posts: Post[];
  tab: PostListTab;
  fetchNextPage: () => void;
};

export default function PostList({ posts, tab, fetchNextPage }: PostListProps) {
  const router = useRouterWithUser();

  const { mutate: createHairConsultationReadingMutation } =
    useCreateHairConsultationReadingMutation();
  const { mutate: createPostReadingMutation } = useCreatePostReadingMutation();

  const handlePostClick = ({
    postId,
    isRead,
    postSource,
  }: {
    postId: number;
    isRead: boolean;
    postSource?: 'new' | 'legacy';
  }) => {
    const isNewPost = postSource === 'new';

    if (!isRead) {
      if (isNewPost) {
        createHairConsultationReadingMutation(postId, { onSuccess: () => {} });
      } else {
        createPostReadingMutation(postId, { onSuccess: () => {} });
      }
    }

    router.push(isNewPost ? ROUTES.POSTS_NEW_DETAIL(postId) : ROUTES.POSTS_DETAIL(postId), {
      [SEARCH_PARAMS.POST_LIST_TAB]: tab,
    });
  };

  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
  });

  if (posts.length === 0) {
    return <PostListEmptyView tab={tab} />;
  }

  return (
    <>
      {posts.map((post, index) => (
        <PostListItem
          key={post.id}
          createdAt={post.createdAt}
          userAddress={post.userAddress}
          price={post.maxPaymentPrice}
          isConsultingPost={true}
          title={post.title}
          content={post.content}
          repImageUrl={post.repImageUrl}
          viewCount={post.viewCount}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          onClick={() =>
            handlePostClick({
              postId: post.id,
              isRead: post.isRead,
              postSource: post.postSource,
            })
          }
          ref={index === posts.length - 2 ? observerRef : undefined}
          isRead={post.isRead}
        />
      ))}
    </>
  );
}
