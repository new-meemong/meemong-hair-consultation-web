'use client';

import ErrorIcon from '@/assets/icons/error.svg';
import { type Post } from '@/entities/posts';
import { POST_TAB } from '@/features/posts/constants/post-tabs';
import { type TabType } from '@/features/posts/types/tabs';
import { useAuthContext } from '@/shared/context/AuthContext';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { type FC } from 'react';
import { PostListItem } from './post-list-item';

interface PostListProps {
  posts: Post[];
  tab: TabType;
  isLoading?: boolean;
  fetchNextPage: () => void;
}

export const PostList: FC<PostListProps> = ({ posts, tab, isLoading = false, fetchNextPage }) => {
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
          {POST_TAB[tab].getEmptyText(user.role)}
        </p>
      </div>
    );
  }

  return (
    <>
      <div
        className={`[&>*:last-child]:border-b-0 ${isLoading ? 'opacity-70 transition-opacity duration-300' : ''}`}
      >
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} onClick={() => handlePostClick(post.id)} />
        ))}
      </div>

      <div ref={observerRef} />
    </>
  );
};
