'use client';

import { type Post } from '@/entities/posts';
import { type PostListTab } from '@/features/posts/types/post-list-tab';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { ROUTES } from '@/shared/lib/routes';

import PostListEmptyView from './post-list-empty-view';
import PostListItem from './post-list-item';

type PostListProps = {
  posts: Post[];
  tab: PostListTab;
  fetchNextPage: () => void;
};

export default function PostList({ posts, tab, fetchNextPage }: PostListProps) {
  const router = useRouterWithUser();

  const handlePostClick = (postId: number) => {
    router.push(ROUTES.POSTS_DETAIL(postId), {
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
          id={post.id}
          updatedAt={post.updatedAt}
          hairConsultPostingCreateUserRegion={post.hairConsultPostingCreateUserRegion}
          price={post.maxPaymentPrice}
          isConsultingPost={true}
          title={post.title}
          content={post.content}
          repImageUrl={post.repImageUrl}
          viewCount={post.viewCount}
          likeCount={post.likeCount}
          commentCount={post.commentCount}
          onClick={() => handlePostClick(post.id)}
          ref={index === posts.length - 2 ? observerRef : undefined}
        />
      ))}
    </>
  );
}
