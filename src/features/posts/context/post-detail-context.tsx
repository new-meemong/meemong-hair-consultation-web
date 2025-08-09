import { createContext, useContext, type ReactNode } from 'react';

import type { PostDetail } from '@/entities/posts/model/post-detail';

import useGetPostDetail from '../api/use-get-post-detail';

type PostDetailContextValue = {
  postDetail: PostDetail;
};

const PostDetailContext = createContext<PostDetailContextValue | null>(null);

type PostDetailProviderProps = {
  children: ReactNode;
  postId: string;
};

export function PostDetailProvider({ children, postId }: PostDetailProviderProps) {
  const { data: postDetailResponse } = useGetPostDetail(postId.toString());

  const postDetail = postDetailResponse?.data;

  if (!postDetail) return null;

  return <PostDetailContext.Provider value={{ postDetail }}>{children}</PostDetailContext.Provider>;
}

export function usePostDetail() {
  const context = useContext(PostDetailContext);

  if (!context) {
    throw new Error('usePostDetail must be used within a PostDetailProvider');
  }

  return context;
}
