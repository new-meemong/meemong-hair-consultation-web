import { SEARCH_PARAMS } from '../constants/search-params';

export const ROUTES = {
  // 메인 페이지
  HOME: '/',

  // 게시글
  POSTS: '/posts',
  POSTS_CREATE: '/posts/create',
  POSTS_CREATE_CONSULTING_POST: (id: string) => `/posts/consulting/create/${id}`,
  POSTS_DETAIL: (id: string | number) => `/posts/${id}`,
  POSTS_EDIT: (id: string) => `/posts/edit/${id}`,
  POSTS_CONSULTING_RESPONSE: (id: string) => `/posts/consulting/${id}`,

  // 채팅
  CHAT_HAIR_CONSULTATION: '/chat/hair-consultation',
  CHAT_HAIR_CONSULTATION_DETAIL: (id: string) => `/chat/hair-consultation/${id}`,

  // 헤어상담
  TODAY_CONSULTANT: '/today-consultant',

  // 신고
  REPORT: (targetId: string) => `/report?${SEARCH_PARAMS.REPORT_TARGET_ID}=${targetId}`,
} as const;

/**
 * 타입 안정성을 위한 네비게이션 함수 생성 함수
 * @param push 네비게이션 함수
 * @returns 네비게이션 함수 객체
 */
export const createNavigation = (push: (href: string) => void) => ({
  toHome: () => push(ROUTES.HOME),
  toPosts: () => push(ROUTES.POSTS),
  toPostsCreate: () => push(ROUTES.POSTS_CREATE),
  toPostsDetail: (id: string | number) => push(ROUTES.POSTS_DETAIL(id)),
  toTodayConsultant: () => push(ROUTES.TODAY_CONSULTANT),
});
