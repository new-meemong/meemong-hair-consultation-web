'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { type Post } from '@/entities/posts';
import { PostListItem } from './post-list-item';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
}

export const PostList: FC<PostListProps> = ({ posts, isLoading = false }) => {
  const router = useRouter();

  const handlePostClick = (postId: number) => {
    router.push(`/posts/${postId}`);
  };

  // if (posts.length === 0) {
  //   return (
  //     <div className="w-full flex justify-center py-12">
  //       <p className="text-gray-500">게시물이 없습니다.</p>
  //     </div>
  //   );
  // }

  return (
    <div
      className={`[&>*:last-child]:border-b-0 ${isLoading ? 'opacity-70 transition-opacity duration-300' : ''}`}
    >
      {posts.map((post) => (
        <PostListItem key={post.id} post={post} onClick={() => handlePostClick(post.id)} />
      ))}
    </div>
  );
};
