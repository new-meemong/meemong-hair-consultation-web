import { type Post } from './types';

/**
 * 게시글 상세 조회 API 요청 파라미터
 */
export interface PostDetailRequest {
  postId: string;
}

/**
 * 게시글 상세 조회 API 응답
 */
export interface PostDetailResponse {
  post: Post | null;
}

/**
 * 게시글 목록 조회 탭 타입
 */
export type PostTabType = 'recent' | 'popular' | 'my' | 'commented' | 'liked';

/**
 * 게시글 목록 조회 API 요청 파라미터
 */
export interface PostListRequest {
  tab: PostTabType;
  page?: number;
  limit?: number;
}

/**
 * 게시글 목록 조회 API 응답
 */
export interface PostListResponse {
  posts: Post[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * 게시글 생성 요청 파라미터
 */
export interface CreatePostRequest {
  title: string;
  content: string;
  isPrivate?: boolean;
  images?: File[];
}

/**
 * 게시글 생성 응답
 */
export interface CreatePostResponse {
  post: Post;
}
