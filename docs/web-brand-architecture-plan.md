# 웹 전환 & 멀티브랜드 아키텍처 개발 계획

> 작성일: 2026-03-19
> 상태: **Phase 2 완료** / Phase 3 대기 중

---

## 배경 및 목적

현재 헤어컨설팅 서비스는 Flutter 모바일 앱 내에서 웹뷰로만 동작합니다.
아래 두 가지 목표를 동시에 달성하기 위한 아키텍처를 설계합니다.

1. **웹 접근 지원**: 앱 없이 브라우저에서 회원가입/로그인 후 헤어컨설팅 이용 가능
2. **멀티브랜드 지원**: 박준뷰티랩 등 외부 브랜드가 커스터마이징된 헤어컨설팅 서비스를 운영 가능

---

## 핵심 설계 원칙

- **"브랜드 = config 파일 하나"**: 새 브랜드 추가 시 코드 복붙이 아니라 config 1개 + 로고 이미지 1개
- **컴포넌트 내 브랜드 분기 금지**: `if (brand === 'parkjun')` 직접 사용 금지. `useBrand()` + config 값만 참조
- **기존 웹뷰 경로 무변경**: Flutter 앱은 기존 URL 그대로 사용. 영향 없음
- **YAGNI**: 지금 필요 없는 복잡도는 추가하지 않음

---

## 라우팅 구조

### 라우트 구조 (Phase 3 목표 최종안)

```
src/app/
  layout.tsx                    ← 공통 provider (QueryProvider, OverlayProvider 등)
  page.tsx                      ← 기존 홈 redirect
  welcome/                      ← 임시 위치. Phase 4 완료 후 /meemong/welcome으로 301 redirect → 이후 제거

  api/                          ← API routes는 항상 루트에 위치 (라우트 그룹 밖)

  (webview)/                    ← 기존 Flutter 웹뷰 전용
    layout.tsx                  ← 웹뷰 AuthProvider (userId 기반)
    posts/
    chat/
    report/

  (web)/                        ← 신규 웹 전용
    layout.tsx                  ← 최소한의 공통 web 레이어 (BrandProvider 없음 — brandSlug 접근 불가)
    [brandSlug]/
      layout.tsx                ← BrandProvider만 (Server Component, 플리커 방지 CSS 변수 주입)
      (public)/                 ← 비로그인 접근 허용
        welcome/page.tsx        ← 브랜드별 웰컴/랜딩 페이지
        login/page.tsx          ← 번호인증 페이지
        sample/page.tsx         ← 샘플 보기 (선택)
      (protected)/              ← 로그인 필수
        layout.tsx              ← 'use client' + WebAuthProvider + 미인증 시 welcome redirect
        posts/
          page.tsx              ← PostsPage wrapper
          [postId]/
            page.tsx
            consulting/
              create/page.tsx
              [responseId]/page.tsx
          create/
            page.tsx
            hair-length/
            hair-concerns/
            hair-texture/
            skin-brightness/
            personal-color/
            complete/
        mypage/page.tsx
```

### 결정 배경 및 고려 옵션

**기존 webview 경로를 `(webview)` 그룹으로 이동할지?**

| 옵션 | 장점 | 단점 |
|------|------|------|
| 이동 O | 레이아웃 완전 분리 가능, 코드 의도 명확 | 파일 이동 작업 필요 |
| 이동 X | 지금 당장 리스크 없음 | 루트 layout에 복잡한 조건 분기 필요 |

> 추천: 이동하는 것이 장기적으로 유지보수에 유리. `(webview)/layout.tsx`에 웹뷰 AuthProvider를 격리할 수 있고, `(web)/[brandSlug]/layout.tsx`에는 BrandProvider만 배치, WebAuthProvider는 그 하위의 `(protected)/layout.tsx`에 독립적으로 구성 가능.

**기본 브랜드(미몽) 웰컴 페이지 URL**

| 옵션 | URL |
|------|-----|
| 통일 | `/meemong/welcome` (모든 브랜드 동일 패턴) |
| 분리 | `/welcome` (미몽 기본), `/{brandSlug}/welcome` (브랜드별) |

> 추천: `/meemong/welcome`으로 통일. 미몽도 브랜드 중 하나로 일관되게 처리.

**미존재 brandSlug 처리 정책**

| 옵션 | 동작 |
|------|------|
| 404 | 등록되지 않은 슬러그는 Not Found |
| Fallback | 미몽 기본 페이지로 리다이렉트 |

> 추천: 404. 명시적이고 SEO에 안전. 개발 환경에서는 `?brand=` override로 테스트 가능.

---

## Brand Config 시스템

### BrandConfig 타입 (Zod 검증 포함)

```ts
// src/shared/config/brand-config.ts
import { z } from 'zod';
import { StepIdSchema } from '@/shared/constants/consultation-steps';

export const BrandConfigSchema = z.object({
  slug: z.string(),
  name: z.string(),
  apiBrandId: z.number().nullable(),  // null = meemong (ALL 타입)
  logo: z.object({
    src: z.string(),
    width: z.number(),
    height: z.number(),
  }),
  theme: z.object({
    colorCautionary: z.string().optional(),
    // 필요 시 확장
  }),
  // StepIdSchema는 DEFAULT_CONSULTATION_FLOW에서 파생 — step 추가/제거 시 자동 동기화
  // .min(1): 빈 배열로 전체 step을 숨기는 의도하지 않은 사용 방지
  // .refine: 중복 stepId 방지 (동일 step이 두 번 나오면 라우팅 오류)
  consultationFlowOverride: z
    .array(StepIdSchema)
    .min(1, 'consultationFlowOverride는 최소 1개 이상이어야 합니다')
    .refine(
      (steps) => new Set(steps).size === steps.length,
      'consultationFlowOverride에 중복된 stepId가 있습니다'
    )
    .optional(),
  features: z.object({
    chat: z.boolean(),
    mong: z.boolean(),
    growthPass: z.boolean(),
  }),
});

export type BrandConfig = z.infer<typeof BrandConfigSchema>;
```

### 브랜드 레지스트리

```ts
// src/shared/config/brands/index.ts
import { meemongConfig } from './meemong';
import { parkjunConfig } from './parkjun';

export const brandRegistry = {
  meemong: meemongConfig,
  parkjun: parkjunConfig,
} as const;

export type BrandSlug = keyof typeof brandRegistry;

// Zod safeParse로 실제 런타임 검증 수행 → 오타/누락 필드 즉시 감지
export function getBrandConfig(slug: string | undefined | null): BrandConfig | null {
  if (!slug || !(slug in brandRegistry)) {
    return null;
  }
  const config = brandRegistry[slug as BrandSlug];
  const result = BrandConfigSchema.safeParse(config);

  if (!result.success) {
    if (process.env.NODE_ENV === 'development') {
      console.error(`Invalid brand config for slug: "${slug}"`, result.error.flatten());
    }
    return null; // 유효하지 않은 config → 404 유도
  }

  return result.data;
}
```

### 브랜드별 설정 예시

```ts
// src/shared/config/brands/meemong.ts
export const meemongConfig: BrandConfig = {
  slug: 'meemong',
  name: '미몽',
  apiBrandId: null,              // brandSelectionType: 'ALL'
  logo: { src: '/logos/meemong.svg', width: 80, height: 24 },
  theme: {},
  features: { chat: true, mong: true, growthPass: true },
};

// src/shared/config/brands/parkjun.ts
export const parkjunConfig: BrandConfig = {
  slug: 'parkjun',
  name: '박준뷰티랩',
  apiBrandId: 1,                 // brandSelectionType: 'BRAND', brandIds: [1]
  logo: { src: '/logos/parkjun.svg', width: 120, height: 32 },
  theme: {
    colorCautionary: '#C8A97E',  // 박준 브랜드 컬러
  },
  features: { chat: false, mong: false, growthPass: false },
};
```

---

## BrandProvider & 플리커 방지

### 초기 렌더 플리커 방지 전략

SSR 환경에서 BrandProvider가 클라이언트 마운트 전에 잠깐 기본 테마로 렌더링되는 문제를 방지합니다.

**주의:** Next.js App Router에서 `<html>`과 `<body>`는 루트 레이아웃(`app/layout.tsx`)만 렌더링할 수 있습니다. 하위 레이아웃에서 `<html>`을 반환하면 오류가 발생합니다.

CSS 변수를 **wrapper div의 `style` 속성에 인라인으로 주입**합니다. 이 wrapper는 서버에서 렌더링되므로 플리커 없이 테마가 적용됩니다.

**공식 채택 방식: `style` 인라인 주입**
- `buildThemeVars(brand.theme)`가 CSS 변수를 직접 주입하므로, 정적 CSS 파일의 `[data-brand="..."]` 선택자는 불필요합니다.
- config 파일(`parkjun.ts`)이 Source of Truth — CSS 파일을 별도로 관리할 필요 없음.

```tsx
// src/app/(web)/[brandSlug]/layout.tsx (서버 컴포넌트 — BrandProvider만)
import { notFound } from 'next/navigation';

export default async function WebLayout({ params, children }) {
  const brand = getBrandConfig(params.brandSlug);
  if (!brand) notFound(); // 미존재 slug → 404

  // <html>은 루트 layout이 관리. wrapper div에 CSS 변수 인라인 주입 (SSR → 플리커 없음)
  // WebAuthProvider는 (protected)/layout.tsx에 배치 — public 페이지에 인증 불필요
  return (
    <div style={buildThemeVars(brand.theme)} className="contents">
      <BrandProvider initialBrand={brand}>
        {children}
      </BrandProvider>
    </div>
  );
}

// src/app/(web)/[brandSlug]/(protected)/layout.tsx ('use client' — WebAuthProvider)
// localStorage에서 web_user_data:${brandSlug} 읽기 → 미인증 시 welcome redirect
// export default function ProtectedLayout({ children }) { ... }

// buildThemeVars 예시
function buildThemeVars(theme: BrandConfig['theme']): React.CSSProperties {
  return {
    ...(theme.colorCautionary && { '--color-cautionary': theme.colorCautionary }),
    // 필요 시 확장
  } as React.CSSProperties;
}
```

> `className="contents"`는 Tailwind의 `display: contents` 유틸리티 클래스로, wrapper div가 레이아웃에 영향을 주지 않게 합니다.

### 개발/QA 브랜드 미리보기

**클라이언트 사이드 `window` 기반 override는 사용하지 않습니다.**
SSR 결과와 CSR이 달라 hydration 불일치와 플리커를 유발합니다.

대신 **서버 사이드 cookie 기반** override를 사용합니다.

```ts
// src/middleware.ts (개발 환경에서만 동작)
// ?brand=parkjun 쿼리파라미터가 있으면 brand_override 쿠키로 저장
// invalid slug를 그대로 저장하면 dev 환경에서 지속 404가 발생하므로
// brandRegistry에 없는 slug는 쿠키를 삭제해 이전 잘못된 override를 초기화
export function middleware(request: NextRequest) {
  const brandOverride = request.nextUrl.searchParams.get('brand');
  const response = NextResponse.next();

  if (process.env.NODE_ENV === 'development' && brandOverride !== null) {
    if (brandOverride in brandRegistry) {
      response.cookies.set('brand_override', brandOverride, { path: '/' });
    } else {
      // 유효하지 않은 slug: 기존 쿠키 삭제 (지속 404 방지)
      response.cookies.delete('brand_override');
      console.warn(`[dev] Invalid brand override slug: "${brandOverride}". Cookie cleared.`);
    }
  }

  return response;
}

// matcher: 정적 리소스(_next/), API routes(/api/), 파비콘, 파일 확장자(.*)는 제외
// middleware가 웹 페이지 경로에만 실행되도록 제한
export const config = {
  matcher: ['/((?!_next/|api/|favicon.ico|.*\\..*).*)', ],
};

// (web)/[brandSlug]/layout.tsx 서버 컴포넌트에서 쿠키 확인
// 개발 환경에서 brand_override 쿠키가 있으면 해당 브랜드로 처리
import { cookies } from 'next/headers';

export default async function WebBrandLayout({ params, children }) {
  const devOverride = process.env.NODE_ENV === 'development'
    ? (await cookies()).get('brand_override')?.value
    : null;
  const slug = devOverride ?? params.brandSlug;
  const brand = getBrandConfig(slug);
  if (!brand) notFound();
  // ...
}
```

> 이 방식은 SSR 시점부터 올바른 브랜드 테마가 주입되므로 플리커가 없습니다.

---

## API 브랜드 매핑

### getBrandSelectionPayload 매퍼

컨설팅 생성 API 호출 시 브랜드별 파라미터를 자동 변환합니다.

```ts
// src/shared/config/brands/api-mapper.ts

export function getBrandSelectionPayload(brand: BrandConfig) {
  if (brand.apiBrandId === null) {
    return { brandSelectionType: 'ALL' as const };
  }
  return {
    brandSelectionType: 'BRAND' as const,
    brandIds: [brand.apiBrandId],
  };
}
```

**사용 예시:**
```ts
// POST /api/v1/hair-consultations 호출 시
const payload = {
  ...formData,
  ...getBrandSelectionPayload(brandConfig),  // 항상 이 매퍼를 통해 merge
};
```

**브랜드별 동작:**
| 브랜드 | brandSelectionType | brandIds |
|--------|-------------------|---------|
| meemong | `ALL` | 생략 |
| parkjun | `BRAND` | `[1]` |

---

## 컨설팅 문항 흐름 관리

### 현재: 모든 브랜드 동일 문항

> **설계 원칙**: step 목록은 `DEFAULT_CONSULTATION_FLOW` 한 곳에서만 정의합니다.
> `StepId` 타입, `StepIdSchema`(Zod), `stepIdToPath`(ROUTES 헬퍼)는 모두 여기서 파생됩니다.
> step을 추가/제거할 때 이 배열만 수정하면 나머지는 자동으로 동기화됩니다.
>
> **FSD 레이어**: `shared/lib/routes.ts`와 `features/posts` 양쪽에서 참조하므로
> `shared` 또는 `entities/posts` 레이어에 위치해야 합니다 (features 레이어 불가).

```ts
// src/shared/constants/consultation-steps.ts  (또는 entities/posts/constants/)
import { z } from 'zod';

// ★ 단일 소스 — StepId, StepIdSchema, stepIdToPath 모두 이 배열에서 파생
export const DEFAULT_CONSULTATION_FLOW = [
  { stepId: 'hairLength',     urlSegment: 'hair-length' },
  { stepId: 'hairConcerns',   urlSegment: 'hair-concerns' },
  { stepId: 'hairTexture',    urlSegment: 'hair-texture' },
  { stepId: 'skinBrightness', urlSegment: 'skin-brightness' },
  { stepId: 'personalColor',  urlSegment: 'personal-color' },
] as const;

// 파생 타입 — step 추가/제거 시 자동 동기화
export type StepId = typeof DEFAULT_CONSULTATION_FLOW[number]['stepId'];

const STEP_IDS = DEFAULT_CONSULTATION_FLOW.map(s => s.stepId) as [StepId, ...StepId[]];
export const StepIdSchema = z.enum(STEP_IDS); // BrandConfigSchema의 consultationFlowOverride에서 사용

export const stepIdToPath = Object.fromEntries(
  DEFAULT_CONSULTATION_FLOW.map(({ stepId, urlSegment }) => [stepId, urlSegment])
) as Record<StepId, string>; // ROUTES 헬퍼에서 사용
```

```ts
// ★ getConsultationFlow는 consultation-steps.ts와 같은 파일에 두지 않습니다.
// brand-config.ts가 StepIdSchema를 consultation-steps.ts에서 import하므로,
// getConsultationFlow가 BrandConfig를 import하면 순환 의존이 발생합니다.
//
//   brand-config.ts  →  consultation-steps.ts  (StepIdSchema 참조)
//   consultation-steps.ts  →  brand-config.ts  (BrandConfig 참조) ← 순환!
//
// 해결: getConsultationFlow를 별도 파일로 분리해 양쪽을 단방향으로 import

// src/shared/lib/get-consultation-flow.ts
import { type BrandConfig } from '@/shared/config/brand-config';
import { DEFAULT_CONSULTATION_FLOW } from '@/shared/constants/consultation-steps';

export function getConsultationFlow(brand: BrandConfig) {
  if (!brand.consultationFlowOverride) return DEFAULT_CONSULTATION_FLOW;
  return brand.consultationFlowOverride.map(
    id => DEFAULT_CONSULTATION_FLOW.find(s => s.stepId === id)!
  );
}
```

### Step 이동 로직 분리

```ts
// src/features/posts/lib/consultation-flow.ts (순수 util - 테스트 가능)
// StepId는 shared/constants/consultation-steps에서 import — 여기서 재정의하지 않음
import { type StepId } from '@/shared/constants/consultation-steps';

// ReadonlyArray<...>로 받아야 DEFAULT(as const 배열)와 getConsultationFlow 반환값(일반 배열) 모두 호환
type ConsultationStep = { stepId: StepId; urlSegment: string };

export function getNextStep(flow: ReadonlyArray<ConsultationStep>, currentStepId: StepId) {
  const idx = flow.findIndex(s => s.stepId === currentStepId);
  return flow[idx + 1] ?? null;
}

export function getPrevStep(flow: ReadonlyArray<ConsultationStep>, currentStepId: StepId) {
  const idx = flow.findIndex(s => s.stepId === currentStepId);
  return flow[idx - 1] ?? null;
}

// src/features/posts/hooks/use-consultation-navigation.ts (hook - router 포함)
export function useConsultationNavigation(currentStepId: StepId) {
  const router = useRouter();
  const { config } = useBrand();
  const flow = getConsultationFlow(config);

  return {
    goNext: () => {
      const next = getNextStep(flow, currentStepId);
      if (next) router.push(ROUTES.WEB_CONSULTATION_STEP(config.slug, next.stepId));
      else router.push(ROUTES.WEB_CONSULTATION_COMPLETE(config.slug));
    },
    goPrev: () => {
      const prev = getPrevStep(flow, currentStepId);
      if (prev) router.push(ROUTES.WEB_CONSULTATION_STEP(config.slug, prev.stepId));
    },
  };
}
```

### ROUTES 헬퍼 계약 (Route Helper Contract)

`ROUTES.WEB_CONSULTATION_STEP`은 brandSlug와 stepId를 받아 **완전한 절대 경로**를 반환합니다.

```ts
// src/shared/lib/routes.ts
export const ROUTES = {
  // 기존 웹뷰용 (변경 없음)
  POSTS: '/posts',
  POSTS_CREATE_HAIR_LENGTH: '/posts/create/hair-length',

  // 신규 웹용 — brandSlug를 첫 번째 인자로 받아 완전한 경로 반환
  WEB_WELCOME:               (brandSlug: string) => `/${brandSlug}/welcome`,
  WEB_POSTS:                 (brandSlug: string) => `/${brandSlug}/posts`,
  WEB_POST_DETAIL:           (brandSlug: string, postId: string) => `/${brandSlug}/posts/${postId}`,
  WEB_CONSULTATION_STEP:     (brandSlug: string, stepId: StepId) => `/${brandSlug}/posts/create/${stepIdToPath[stepId]}`,
  WEB_CONSULTATION_COMPLETE: (brandSlug: string) => `/${brandSlug}/posts/create/complete`,
} as const;

// stepIdToPath는 DEFAULT_CONSULTATION_FLOW에서 파생 — 직접 정의하지 않음
// import { stepIdToPath } from '@/shared/constants/consultation-steps';

// 사용 예시
ROUTES.WEB_CONSULTATION_STEP('parkjun', 'hairLength')
// → '/parkjun/posts/create/hair-length'
```

---

## 인증 구조

### 웹뷰 인증 (기존 유지)

- Flutter가 `?userId=<id>` URL 파라미터 주입
- `AuthProvider`가 userId로 웹뷰 로그인 API 호출 → JWT 발급
- JWT를 `localStorage.user_data`에 저장

### 웹 인증 (Phase 3)

#### 확정된 설계 결정

| 항목 | 결정 | 비고 |
|------|------|------|
| 인증 수단 | 휴대폰 번호 인증(SMS OTP) → JWT 발급 | 백엔드 API 연동 필요 |
| 토큰 저장 방식 | **localStorage** | 구현 단순, 기존 webview 코드와 분리 |
| 저장 키 이름 | **`web_user_data:${brandSlug}`** | 웹뷰 `user_data`와 완전 분리, 멀티브랜드 동시 세션 대비 |
| 웹 유저 역할 | **모델 유저만** (디자이너 없음) | isUserDesigner 항상 false |
| 보안 가드 위치 | **API 401 책임** | 클라이언트 가드는 UX용 (리다이렉트) |
| 클라이언트 가드 방식 | Client Component + useEffect redirect | 서버 가드 불가 (localStorage는 서버에서 읽기 불가) |

> **보안 경계 명시**: `(protected)` 레이아웃의 클라이언트 가드는 UX 목적(웰컴 페이지로 이동)이며 실제 데이터 보호는 API 서버의 401 응답이 담당합니다. 이 원칙은 개발 문서에 반드시 명시합니다.

#### localStorage 키 정책

```ts
// 키 네이밍: 브랜드 슬러그 포함 → 멀티브랜드 독립 세션 보장
const WEB_USER_DATA_KEY = (brandSlug: string) => `web_user_data:${brandSlug}`;

// 저장 데이터: JWT 원문 전체가 아닌 최소 정보만 저장
type WebUserData = {
  token: string;          // JWT access token
  expiresAt: number;      // unix timestamp (ms)
  user: {
    id: number;
    name: string;
    sex: string;
    region: string | null;
    profilePictureURL: string | null;
    // 필요한 최소 필드만 — 전체 유저 객체 저장 금지
  };
};
```

#### webview / web 세션 분리 정책

- webview 로그인 상태 (`user_data`) ↔ 웹 브랜드 로그인 상태 (`web_user_data:${brandSlug}`) 는 서로 영향을 주지 않음
- 웹 브랜드 로그아웃은 해당 brandSlug 키만 삭제 (`web_user_data:meemong`, `web_user_data:parkjun` 개별 관리)
- 동일 브라우저에서 meemong/parkjun 동시 로그인 가능

#### WebAuthProvider 계약 (Contract)

기존 컴포넌트가 `useOptionalAuthContext()`로 접근하는 값을 동일하게 제공해야 합니다:

```ts
// WebAuthProvider가 제공해야 하는 컨텍스트 인터페이스
type WebAuthContextValue = {
  user: UserModel | null;
  isUserModel: boolean;          // user !== null 이면 항상 true
  isUserDesigner: boolean;       // 항상 false (웹은 모델 전용)
  updateUser: (partial: Partial<UserModel>) => void;
};
```

#### 토큰 만료 처리 규칙

1. `WebAuthProvider` 마운트 시 `expiresAt < Date.now()` 확인 → 만료면 즉시 키 삭제 + welcome redirect
2. API 응답 401 수신 시 공통 인터셉터(`apiClient`)에서 `web_user_data:${brandSlug}` 삭제 + welcome redirect
3. 재접속 시: 유효한 키 있음 → 마이페이지, 없음/만료 → 웰컴 페이지

```tsx
// 미인증 처리 시 next_url 패턴 적용
// 예: /parkjun/posts/123 접근 → /parkjun/welcome?next_url=%2Fparkjun%2Fposts%2F123
// 로그인 완료 후 next_url로 redirect (동일 origin 검증 필수)

// next_url 보안 검증:
// decodeURIComponent(nextUrl).startsWith('/') && !decodeURIComponent(nextUrl).startsWith('//')
// 조건 불만족 시 /{brandSlug}/posts로 fallback
```

#### 라우트 그룹 구조 (Phase 3 목표)

```
src/app/(web)/[brandSlug]/
  (public)/
    welcome/page.tsx              ← 브랜드 랜딩/웰컴 페이지
    login/page.tsx                ← 번호인증 페이지
    sample/page.tsx               ← 샘플 보기 (선택)
  (protected)/
    layout.tsx                    ← 'use client' + WebAuthProvider + 클라이언트 가드
    posts/...                     ← 기존 웹 브랜드 posts 라우트 이동
    mypage/page.tsx               ← 마이페이지
```

---

## Thin Wrapper 패턴

실제 페이지 로직은 `features` 레이어에, 라우트 파일은 얇은 wrapper만 유지합니다.

```ts
// src/features/posts/pages/posts-page.tsx (실제 로직 — features 레이어)
// useBrand()로 브랜드 정보를 직접 읽음 (brandSlug prop 불필요)
export function PostsPage() {
  const { config: brand } = useBrand();
  // ... 모든 페이지 로직
}

// src/app/(web)/[brandSlug]/(protected)/posts/page.tsx (wrapper — Phase 3 목표)
import { PostsPage } from '@/features/posts/pages/posts-page';
export default function Page() {
  return <PostsPage />;
}
```

---

## Routes 헬퍼 확장

기존 `src/shared/lib/routes.ts`의 `ROUTES` 상수를 브랜드 slug를 받는 형태로 확장합니다.

```ts
// 기존 (웹뷰용 - 변경 없음)
ROUTES.POSTS: '/posts'

// 신규 (웹용)
ROUTES.WEB_POSTS: (brandSlug: string) => `/${brandSlug}/posts`
ROUTES.WEB_WELCOME: (brandSlug: string) => `/${brandSlug}/welcome`
ROUTES.WEB_POST_DETAIL: (brandSlug: string, postId: string) => `/${brandSlug}/posts/${postId}`
// ...
```

> **FSD 레이어 주의**: `WEB_CONSULTATION_STEP`에서 사용하는 `StepId` 타입은 `shared/lib/routes.ts`에서 참조되므로, `features` 레이어가 아닌 `shared` 또는 `entities/posts` 레이어에 정의되어야 합니다. `DEFAULT_CONSULTATION_FLOW as const` 배열도 동일 레이어에 위치시켜야 FSD 의존성 규칙을 위반하지 않습니다.

---

## 구현 순서 (Phase)

### Phase 1 - 기반 구조 ✅ 완료
- [x] Brand Config 타입 정의 (Zod 포함) — `src/shared/config/brand-config.ts`
- [x] meemong, parkjun config 파일 작성 — `src/shared/config/brands/{meemong,parkjun}.ts`
- [x] getBrandConfig, getBrandSelectionPayload 구현 — `src/shared/config/brands/index.ts`
- [x] BrandProvider + useBrand() 훅 — `src/shared/context/brand-context.tsx`
- [x] `(web)/[brandSlug]` 라우트 그룹 및 layout 세팅 — `src/app/(web)/[brandSlug]/layout.tsx`
- [x] `/{brandSlug}/welcome` 페이지 (로고, 테마 적용) — `src/app/(web)/[brandSlug]/welcome/page.tsx` (Phase 1 당시 경로; Phase 3에서 `(web)/[brandSlug]/(public)/welcome/...`로 이동 예정)
- [x] 플리커 방지: SSR layout에서 wrapper `<div style={buildThemeVars(brand.theme)}>` 인라인 CSS 변수 주입 (App Router `<html>` 제약 우회)
- [x] 개발용 brand override: middleware가 `?brand=` 쿼리를 `brand_override` 쿠키로 저장 → layout에서 서버사이드 쿠키 읽기

### Phase 2 - 웹 페이지 구현 ✅ 완료
- [x] 기존 webview 페이지 공통 로직을 `features/posts/pages/`로 추출 — 5개 step page 컴포넌트 (onComplete/onBack 콜백 기반)
- [x] `(web)/[brandSlug]/posts/...` wrapper 페이지 추가 — posts, [postId], [postId]/consulting/[responseId], create/*, create/complete (Phase 2 당시 경로; Phase 3에서 `(web)/[brandSlug]/(protected)/posts/...`로 이동 예정)
- [x] `useConsultationNavigation` 훅 및 `getNextStep`/`getPrevStep` util — `features/posts/lib/consultation-flow.ts`, `features/posts/hooks/use-consultation-navigation.ts`
- [x] Routes 헬퍼 웹용 확장 — `WEB_WELCOME`, `WEB_POSTS`, `WEB_POST_DETAIL`, `WEB_CONSULTATION_STEP`, `WEB_CONSULTATION_COMPLETE` 추가
<!-- 채팅: 현재 웹뷰에서만 동작 (Flutter 브릿지 window.openChatChannel 사용). 추후 웹에서도 채팅을 지원할 경우 (web)/[brandSlug]/chat/... 라우트 신설 및 BrandConfig features.chat 플래그 활용 필요. -->

### Phase 3 - 웹 인증

#### 사전 확정 결정사항

- **저장 방식**: localStorage (`web_user_data:${brandSlug}` 키, webview `user_data`와 완전 분리)
- **유저 역할**: 모델 전용 (isUserDesigner 항상 false)
- **보안 경계**: 클라이언트 가드 = UX용, 실제 보호 = API 401 책임
- **브랜드별 독립 세션**: `web_user_data:meemong` / `web_user_data:parkjun` 개별 관리

#### 구현 항목

- [ ] `(public)` / `(protected)` 라우트 그룹 생성
- [ ] 번호인증 페이지 (`/{brandSlug}/login`) — `(public)` 그룹
- [ ] 번호인증 API 연동 → JWT 발급 → `web_user_data:${brandSlug}` 저장
- [ ] `WebAuthProvider` 구현 (Client Component)
  - localStorage에서 `web_user_data:${brandSlug}` 읽기
  - 만료 체크 (`expiresAt < Date.now()`) → 만료 시 키 삭제 + welcome redirect
  - 컨텍스트 제공: `user`, `isUserModel`, `isUserDesigner: false`, `updateUser`
- [ ] `(protected)/layout.tsx` — WebAuthProvider + 미인증 시 `/{brandSlug}/welcome?next_url=...` redirect
- [ ] `apiClient` 공통 인터셉터에 401 처리 추가 — `web_user_data:${brandSlug}` 삭제 + welcome redirect
- [ ] 로그인 성공 후 `next_url` 복귀 (동일 origin 검증: `/`로 시작 && `//`로 시작하지 않음)
- [ ] 재접속 자동 로그인: 유효한 캐시 있음 → 마이페이지, 없음/만료 → 웰컴 페이지

### Phase 4 - 기존 경로 구조 정리 (선택)
- [ ] 기존 `/posts/...` 등을 `(webview)/` 그룹으로 이동
- [ ] `(webview)/layout.tsx`에 웹뷰 AuthProvider 격리

---

## 결정 사항 요약

| # | 항목 | **결정** |
|---|------|------|
| 1 | 기존 경로 `(webview)` 이동 | **이동 O** (Phase 4) |
| 2 | 기본 브랜드 웰컴 URL | **`/meemong/welcome`** (모든 브랜드 동일 패턴) — 루트 `/welcome`은 Phase 4 후 301 redirect → 제거 |
| 3 | 미존재 slug 정책 | **404** |

---

## 예약 슬러그 정책

Next.js App Router는 정적 경로가 동적 경로보다 우선하므로, 기술적 충돌은 발생하지 않습니다.
그러나 브랜드 slug가 기능 경로와 같은 이름이면 사용자에게 혼란을 주므로 **비즈니스 정책**으로 금지합니다.

브랜드 slug로 사용 불가한 이름 (기술적 충돌 또는 사용자 혼란 방지):

| 슬러그 | 이유 |
|--------|------|
| `api` | Next.js API routes (`/api/...`) |
| `meemong` | 기본 브랜드로 이미 등록됨 — **신규** 브랜드 슬러그로 사용 불가 (기존 `/meemong/welcome` 등 경로는 정상 사용) |
| `posts` | 웹뷰 라우트 (`/posts/...`) — `/posts/posts` 같은 혼란 URL 방지 |
| `chat` | 웹뷰 라우트 (`/chat/...`) |
| `report` | 웹뷰 라우트 (`/report/...`) |
| `welcome` | 예정된 웹 공통 경로 |
| `login` | 예정된 웹 인증 경로 |
| `signup` | 예정된 웹 인증 경로 |

> **검증 위치**: 브랜드 등록 시점(`brandRegistry`에 추가할 때)에 이 목록과 대조 검증합니다.
> 코드 레벨 RESERVED_SLUGS 배열을 `brandRegistry` 파일 내에 함께 관리해 누락을 방지합니다.

**`b_parkjun` 같은 prefix 방식은 채택하지 않습니다.**
기술적으로는 충돌을 완전히 차단하지만, 구현 세부사항이 URL에 노출되어 B2B 클라이언트의 브랜드 가치를 해칩니다. 등록 시점 검증으로 충분합니다.

---

## 리스크 및 의존성

| 항목 | 내용 |
|------|------|
| 백엔드 API | 컨설팅 조회 API 응답에 `brandId` 포함 여부 확인 필요 (앱 분기처리를 위해) |
| Flutter 앱 | Phase 4 실행 시 URL 변경 없음을 재확인 필요 |
| 인증 API | 휴대폰 번호 인증 엔드포인트 백엔드 설계 필요 |

## 구현 검증 체크리스트

Phase별 구현 완료 후 아래 항목을 반드시 확인합니다.

**Brand Config / BrandConfigSchema**
- [ ] `consultationFlowOverride: []` (빈 배열) 저장 시 Zod validation 에러 발생
- [ ] `consultationFlowOverride: ['hairLength', 'hairLength']` (중복) 저장 시 Zod validation 에러 발생
- [ ] 유효한 override 배열은 정상 저장되고 `getConsultationFlow`가 올바른 step 순서 반환

**개발용 brand override**
- [ ] `?brand=parkjun` 접근 시 `brand_override` 쿠키 저장 + parkjun 테마 적용 확인
- [ ] `?brand=invalid` 접근 시 쿠키 저장 안 되고 기존 쿠키 삭제 확인 (지속 404 미발생)
- [ ] 쿠키 삭제 후 재접근 시 URL의 실제 brandSlug로 fallback 확인

**인증 가드**
- [ ] `/{brandSlug}/welcome` — `(public)` 라우트 그룹에 위치하므로 WebAuthProvider 미적용, 비로그인 접근 가능 (Phase 3 구현 후 검증)
- [ ] 보호 경로(`/{brandSlug}/posts` 등) — 미인증 시 `/{brandSlug}/welcome?next_url=...`으로 redirect (Phase 3)
- [ ] 토큰 만료 시 즉시 `web_user_data:${brandSlug}` 삭제 + welcome redirect (Phase 3)
- [ ] API 401 응답 시 공통 인터셉터에서 `web_user_data:${brandSlug}` 삭제 + welcome redirect (Phase 3)
- [ ] `next_url` 파라미터 보안 검증: `/`로 시작 && `//`로 시작하지 않아야 함, 실패 시 `/{brandSlug}/posts` fallback (Phase 3)
- [ ] 멀티브랜드 검증: `/meemong/posts`, `/parkjun/posts` 각각 독립적으로 보호/복귀 동작 확인 (Phase 3)
- [ ] webview/web 세션 독립 검증: webview 로그아웃이 web 브랜드 세션에 영향 없음 확인 (Phase 3)
