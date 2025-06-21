'use client';

import { FC } from 'react';
import { useRouter } from 'next/navigation';
import { type Post } from '@/entities/posts';
import { PostItem } from './post-item';

interface PostListProps {
  posts: Post[];
  isLoading?: boolean;
}

export const PostList: FC<PostListProps> = ({ posts, isLoading = false }) => {
  const router = useRouter();

  const handlePostClick = (postId: string) => {
    router.push(`/posts/${postId}`);
  };

  if (posts.length === 0) {
    return (
      <div className="w-full flex justify-center py-12">
        <p className="text-gray-500">게시물이 없습니다.</p>
      </div>
    );
  }

  return (
    <div
      className={`[&>*:last-child]:border-b-0 ${isLoading ? 'opacity-70 transition-opacity duration-300' : ''}`}
    >
      {posts.map((post) => (
        <PostItem
          key={post.id}
          id={post.id}
          author={post.author}
          title={post.title}
          content={post.content}
          imageUrl={post.imageUrl}
          createdAt={post.createdAt}
          views={post.views}
          likes={post.likes}
          comments={post.comments}
          onClick={() => handlePostClick(post.id)}
        />
      ))}
    </div>
  );
};
