// 앱의 모든 라우트를 타입 안전하게 정의
export const ROUTES = {
  // 메인 페이지
  HOME: '/',

  // 게시글
  POSTS: '/posts',
  POSTS_CREATE: '/posts/create',
  POSTS_DETAIL: (id: string | number) => `/posts/${id}`,

  // Dev
  EXAMPLE: '/example',
  DESIGN_GUIDE: '/design-guide',
} as const;

export type AppRoute =
  | (typeof ROUTES)[keyof typeof ROUTES]
  | ReturnType<typeof ROUTES.POSTS_DETAIL>;

// 라우트 유틸리티 함수들

// 네비게이션 헬퍼 (router.push의 타입 안전한 래퍼)
export const createNavigation = (push: (href: string) => void) => ({
  toHome: () => push(ROUTES.HOME),
  toPosts: () => push(ROUTES.POSTS),
  toPostsCreate: () => push(ROUTES.POSTS_CREATE),
  toPostsDetail: (id: string | number) => push(ROUTES.POSTS_DETAIL(id)),
  toExample: () => push(ROUTES.EXAMPLE),
  toDesignGuide: () => push(ROUTES.DESIGN_GUIDE),
});
