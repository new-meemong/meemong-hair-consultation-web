// ★ 브랜드 slug 단일 소스
// - middleware: 경량 slug 검증에 사용 (이미지 등 무거운 의존성 없음)
// - brands/index.ts: 서버 기동 시 brandRegistry와 일치 여부 자동 검증
// 새 브랜드 추가 시 여기에만 추가하면 index.ts가 불일치를 즉시 감지
export const ALLOWED_BRAND_SLUGS = new Set(['meemong', 'vog']);
