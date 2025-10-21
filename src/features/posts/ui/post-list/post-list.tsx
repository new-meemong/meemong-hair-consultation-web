'use client';

import ErrorIcon from '@/assets/icons/error.svg';
import { type Post } from '@/entities/posts';
import { useAuthContext } from '@/features/auth/context/auth-context';
import { POST_LIST_TAB } from '@/features/posts/constants/post-list-tabs';
import { type PostListTab } from '@/features/posts/types/post-list-tab';
import { SEARCH_PARAMS } from '@/shared/constants/search-params';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import PostListItem from './post-list-item';

type PostListProps = {
  posts: Post[];
  tab: PostListTab;
  fetchNextPage: () => void;
  isConsultingPost: boolean;
};

export default function PostList({ posts, tab, fetchNextPage, isConsultingPost }: PostListProps) {
  const router = useRouterWithUser();
  const { user } = useAuthContext();

  const handlePostClick = (postId: number) => {
    router.push(`/posts/${postId}`, {
      [SEARCH_PARAMS.POST_LIST_TAB]: tab,
    });
  };

  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
  });

  if (posts.length === 0) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center pt-30">
        <ErrorIcon className="size-7 fill-label-info" />
        <p className="typo-body-1-medium text-label-placeholder">
          {POST_LIST_TAB[tab].getEmptyText(user.role)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="flex-1">
        <div className="[&>*:last-child]:border-b-0">
          {posts.map((post, index) => (
            <PostListItem
              key={post.id}
              post={post}
              onClick={() => handlePostClick(post.id)}
              ref={index === posts.length - 2 ? observerRef : undefined}
              isConsultingPost={isConsultingPost}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
