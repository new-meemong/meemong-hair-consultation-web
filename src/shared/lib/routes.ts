import { type StepId, stepIdToPath } from '../constants/consultation-steps';
import { SEARCH_PARAMS } from '../constants/search-params';

export const ROUTES = {
  // 메인 페이지
  HOME: '/',

  // 게시글
  POSTS: '/posts',
  POSTS_CREATE: '/posts/create',
  POSTS_CREATE_HAIR_LENGTH: '/posts/create/hair-length',
  POSTS_CREATE_HAIR_CONCERNS: '/posts/create/hair-concerns',
  POSTS_CREATE_HAIR_TEXTURE: '/posts/create/hair-texture',
  POSTS_CREATE_SKIN_BRIGHTNESS: '/posts/create/skin-brightness',
  POSTS_CREATE_PERSONAL_COLOR: '/posts/create/personal-color',
  POSTS_CREATE_CONSULTING_POST: (postId: string) => `/posts/${postId}/consulting/create`,
  POSTS_DETAIL: (postId: string | number) => `/posts/${postId}`,
  POSTS_CONSULTING_RESPONSE: (postId: string, responseId: string) =>
    `/posts/${postId}/consulting/${responseId}`,
  POSTS_SELECT_REGION: '/posts/select-region',
  POSTS_EXPERIENCE_GROUP_DETAIL: (id: string) => `/posts/experience-groups/${id}`,
  POSTS_EXPERIENCE_GROUP_EDIT: (id: string) => `/posts/experience-groups/${id}/edit`,

  // 채팅
  CHAT_HAIR_CONSULTATION: '/chat/hair-consultation',
  CHAT_HAIR_CONSULTATION_DETAIL: (id: string) => `/chat/hair-consultation/${id}`,

  // 헤어상담
  TODAY_CONSULTANT: '/today-consultant',

  // 신고
  REPORT: (targetId: string) => `/report?${SEARCH_PARAMS.REPORT_TARGET_ID}=${targetId}`,

  // 웹 브랜드 경로 (brandSlug를 첫 번째 인자로 받아 완전한 경로 반환)
  WEB_WELCOME: (brandSlug: string) => `/${brandSlug}/welcome`,
  WEB_SAMPLE: (brandSlug: string) => `/${brandSlug}/sample`,
  WEB_AUTH_PHONE: (brandSlug: string) => `/${brandSlug}/auth/phone`,
  WEB_AUTH_SIGNUP: (brandSlug: string) => `/${brandSlug}/auth/signup`,
  WEB_AUTH_LINK: (brandSlug: string) => `/${brandSlug}/auth/link`,
  WEB_MY: (brandSlug: string) => `/${brandSlug}/my`,
  WEB_POSTS: (brandSlug: string) => `/${brandSlug}/posts`,
  WEB_POSTS_CREATE: (brandSlug: string) => `/${brandSlug}/posts/create`,
  WEB_POST_DETAIL: (brandSlug: string, postId: string) => `/${brandSlug}/posts/${postId}`,
  WEB_CONSULTING_RESPONSE: (brandSlug: string, postId: string, responseId: string) =>
    `/${brandSlug}/posts/${postId}/consulting/${responseId}`,
  WEB_CONSULTATION_STEP: (brandSlug: string, stepId: StepId) =>
    `/${brandSlug}/posts/create/${stepIdToPath[stepId]}`,
  WEB_CONSULTATION_COMPLETE: (brandSlug: string) => `/${brandSlug}/posts/create/complete`,
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
  toPostsDetail: (postId: string | number) => push(ROUTES.POSTS_DETAIL(postId)),
  toTodayConsultant: () => push(ROUTES.TODAY_CONSULTANT),
});
