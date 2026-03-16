import { createContext, useContext, useEffect, type ReactNode } from 'react';

import type { PostDetail } from '@/entities/posts/model/post-detail';

import useGetHairConsultationDetail from '../api/use-get-hair-consultation-detail';
import mapHairConsultationDetailToPostDetail from '../lib/map-hair-consultation-detail-to-post-detail';

type PostDetailContextValue = {
  postDetail: PostDetail;
  isConsultingPost: boolean;
};

const PostDetailContext = createContext<PostDetailContextValue | null>(null);

type PostDetailProviderProps = {
  children: ReactNode;
  postId: string;
  onNotFound?: () => void;
};

export function PostDetailProvider({ children, postId, onNotFound }: PostDetailProviderProps) {
  const {
    data: postDetailResponse,
    isPending,
    isError,
  } = useGetHairConsultationDetail(postId.toString());
  const postDetail = postDetailResponse?.data
    ? mapHairConsultationDetailToPostDetail(postDetailResponse.data)
    : null;

  useEffect(() => {
    if (!isPending && (isError || !postDetail)) {
      onNotFound?.();
    }
  }, [isPending, isError, postDetail, onNotFound]);

  if (isPending || !postDetail) return null;

  return (
    <PostDetailContext.Provider value={{ postDetail, isConsultingPost: true }}>
      {children}
    </PostDetailContext.Provider>
  );
}

export function NewPostDetailProvider({ children, postId, onNotFound }: PostDetailProviderProps) {
  return (
    <PostDetailProvider postId={postId} onNotFound={onNotFound}>
      {children}
    </PostDetailProvider>
  );
}

export function usePostDetail() {
  const context = useContext(PostDetailContext);

  if (!context) {
    throw new Error('usePostDetail must be used within a PostDetailProvider');
  }

  return context;
}
