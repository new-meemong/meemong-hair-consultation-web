import { type Feed } from './types';

/**
 * 피드 상세 조회 API 요청 파라미터
 */
export interface FeedDetailRequest {
  feedId: string;
}

/**
 * 피드 상세 조회 API 응답
 */
export interface FeedDetailResponse {
  feed: Feed | null;
}

/**
 * 피드 목록 조회 탭 타입
 */
export type FeedTabType = 'recent' | 'popular' | 'my' | 'commented' | 'liked';

/**
 * 피드 목록 조회 API 요청 파라미터
 */
export interface FeedListRequest {
  tab: FeedTabType;
  page?: number;
  limit?: number;
}

/**
 * 피드 목록 조회 API 응답
 */
export interface FeedListResponse {
  feeds: Feed[];
  totalCount: number;
  hasMore: boolean;
}

/**
 * 피드 생성 요청 파라미터
 */
export interface CreateFeedRequest {
  title: string;
  content: string;
  isPrivate?: boolean;
  images?: File[];
}

/**
 * 피드 생성 응답
 */
export interface CreateFeedResponse {
  feed: Feed;
}
