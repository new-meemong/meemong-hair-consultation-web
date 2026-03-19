import { type NextRequest, NextResponse } from 'next/server';

// 경량 모듈 사용 — 이미지 등 무거운 brand config 의존성 없이 slug 검증만 수행
import { ALLOWED_BRAND_SLUGS } from '@/shared/config/brands/allowed-slugs';

// 개발 환경에서 ?brand=parkjun 쿼리파라미터로 브랜드 미리보기
// invalid slug는 쿠키를 삭제해 지속 404 방지
export function middleware(request: NextRequest) {
  const brandOverride = request.nextUrl.searchParams.get('brand');
  const response = NextResponse.next();

  if (process.env.NODE_ENV === 'development' && brandOverride !== null) {
    if (ALLOWED_BRAND_SLUGS.has(brandOverride)) {
      response.cookies.set('brand_override', brandOverride, { path: '/' });
    } else {
      response.cookies.delete('brand_override');
      console.warn(`[dev] Invalid brand override slug: "${brandOverride}". Cookie cleared.`);
    }
  }

  return response;
}

// 정적 리소스(_next/), API routes(/api/), 파비콘, 파일 확장자는 제외
export const config = {
  matcher: ['/((?!_next/|api/|favicon.ico|.*\\..*).*)', ],
};
