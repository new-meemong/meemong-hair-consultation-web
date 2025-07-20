'use client';

import ErrorIcon from '@/assets/icons/error.svg';
import { type Post } from '@/entities/posts';
import { POST_LIST_TAB } from '@/features/posts/constants/post-list-tabs';
import { type PostListTab } from '@/features/posts/types/post-list-tab';
import { useAuthContext } from '@/shared/context/auth-context';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import PostListItem from './post-list-item';

type PostListProps = {
  posts: Post[];
  tab: PostListTab;
  fetchNextPage: () => void;
};

export default function PostList({ posts, tab, fetchNextPage }: PostListProps) {
  const router = useRouterWithUser();
  const { user } = useAuthContext();

  const handlePostClick = (postId: number) => {
    router.push(`/posts/${postId}`);
  };

  const observerRef = useIntersectionObserver({
    onIntersect: fetchNextPage,
  });

  if (posts.length === 0) {
    return (
      <div className="flex flex-col gap-2 items-center justify-center pt-30">
        <ErrorIcon className="size-7" />
        <p className="typo-body-1-medium text-label-placeholder">
          {POST_LIST_TAB[tab].getEmptyText(user.role)}
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full overflow-hidden">
      <div className="flex-1 overflow-y-auto">
        <div className="[&>*:last-child]:border-b-0">
          {posts.map((post) => (
            <PostListItem key={post.id} post={post} onClick={() => handlePostClick(post.id)} />
          ))}
        </div>
        <div ref={observerRef} />
      </div>
    </div>
  );
}
