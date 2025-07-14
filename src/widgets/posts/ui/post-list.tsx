'use client';

import { type Post } from '@/entities/posts';
import { POST_TAB } from '@/features/posts/constants/post-tabs';
import { type TabType } from '@/features/posts/types/tabs';
import { useAuthContext } from '@/shared/context/auth-context';
import { useIntersectionObserver } from '@/shared/hooks/use-intersection-observer';
import { useRouter } from 'next/navigation';
import { type FC } from 'react';
import { PostListItem } from './post-list-item';
import ErrorIcon from '@/assets/icons/error.svg';

interface PostListProps {
  posts: Post[];
  tab: TabType;
  fetchNextPage: () => void;
}

export const PostList: FC<PostListProps> = ({ posts, tab, fetchNextPage }) => {
  const router = useRouter();
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
      <div className="[&>*:last-child]:border-b-0">
        {posts.map((post) => (
          <PostListItem key={post.id} post={post} onClick={() => handlePostClick(post.id)} />
        ))}
      </div>
      <div ref={observerRef} />
    </>
  );
};
