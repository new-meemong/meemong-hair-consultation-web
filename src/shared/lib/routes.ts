export const ROUTES = {
  // 메인 페이지
  HOME: '/',

  // 게시글
  POSTS: '/posts',
  POSTS_CREATE: '/posts/create',
  POSTS_DETAIL: (id: string | number) => `/posts/${id}`,
  POSTS_EDIT: (id: string) => `/posts/edit/${id}`,

  // 헤어상담
  TODAY_CONSULTANT: '/today-consultant',
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
