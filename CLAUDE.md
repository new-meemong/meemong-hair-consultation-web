# CLAUDE.md

이 파일은 Claude Code (claude.ai/code)가 이 저장소에서 작업할 때 참고하는 가이드입니다.

## 명령어

```bash
npm run dev          # 개발 서버 실행 (포트 3002, Turbopack)
npm run build        # 프로덕션 빌드
npm run lint         # ESLint 실행
npm run format       # Prettier 포맷팅
npm run test         # 테스트 실행 (Vitest)
npm run test:watch   # 테스트 감시 모드
npm run test:coverage
```

특정 테스트 파일만 실행:

```bash
npx vitest run src/shared/lib/time-utils.test.ts
```

## 아키텍처

이 앱은 **Flutter 모바일 앱 내에 임베드된 Next.js 15 웹뷰 앱**입니다. 독립형 웹앱이 아니며, 모든 페이지는 인증을 위해 URL에 `?userId=<id>` 쿼리 파라미터가 반드시 필요합니다.

### Flutter 브릿지

앱은 `src/app/layout.tsx`에 정의된 JavaScript 채널을 통해 Flutter 호스트 앱과 통신합니다:

- `window.goAppRouter(path)` — Flutter 앱 내 라우팅 이동
- `window.closeWebview(message)` — 웹뷰 닫기
- `window.openChatChannel(message)` — Flutter에서 채팅 채널 열기
- `window.externalLink(url)` — 외부 링크 열기
- `window.setCustomBackAction(hasAction)` — 안드로이드 뒤로가기 버튼 동작 재정의

### 폴더 구조 (Feature-Sliced Design)

```
src/
  app/          # Next.js App Router 페이지 및 레이아웃
  widgets/      # 페이지 단위 복합 컴포넌트 (컨테이너)
  features/     # 사용자 기능 모듈
  entities/     # 비즈니스 도메인 모델 및 API 타입
  shared/       # 공통 유틸리티, UI 기본 요소, 훅
```

**의존성 규칙**: 각 레이어는 자신보다 하위 레이어만 import할 수 있습니다 (`app` > `widgets` > `features` > `entities` > `shared`).

각 레이어 내부 디렉토리 구조: `api/`, `model/`, `lib/`, `ui/`, `constants/`, `hooks/`, `types/`.

### 인증

- `AuthProvider` (`src/features/auth/context/auth-context.tsx`)가 URL 쿼리 파라미터에서 `userId`를 읽어 웹뷰 로그인 API를 호출하여 JWT를 발급받습니다.
- JWT와 사용자 데이터는 `localStorage`의 `user_data` 키에 저장됩니다.
- 토큰은 화면 가시성 변경, 포커스, 403 응답, 5분 인터벌에 자동으로 갱신됩니다.
- `useAuthContext()`로 `user`, `isUserModel`, `isUserDesigner`, `updateUser`를 사용할 수 있습니다.
- 유저 역할: `MODEL = 1`, `DESIGNER = 2` (`src/entities/user/constants/user-role.ts`).

### API 클라이언트

`src/shared/api/client.ts`에서 `ky` 기반 클라이언트 두 가지를 export합니다:

- `apiClient` — 자동으로 JWT Bearer 토큰을 요청 헤더에 첨부
- `apiClientWithoutAuth` — 로그인 엔드포인트 등 인증 불필요 요청에 사용

기본 URL: `NEXT_PUBLIC_API_URL/api/v1`. 모든 요청에 `platform: HAIR_CONSULTING_WEB`, `web-version: 1.1.1` 헤더가 포함됩니다. 403 응답 시 `AUTH_TOKEN_EXPIRED_EVENT`를 dispatch하고 사용자 데이터를 초기화합니다.

API 훅은 `src/features/<도메인>/api/`에 위치하며 TanStack Query(`useQuery`, `useMutation`)를 사용합니다.

### 실시간 채팅

채팅은 Firebase Firestore를 사용합니다. `src/shared/lib/firebase.ts`에서 앱을 초기화하고 환경에 따라 데이터베이스 ID를 선택합니다:

- 프로덕션 (`https://api.meemong.com`): `meemong-chat`
- 그 외: `meemong-dev`

채팅 상태는 `src/features/chat/store/hair-consultation-chat-message-store.ts`의 Zustand 스토어로 관리합니다. 메시지는 `hairConsultationChatChannels/{channelId}/messages`, 유저별 채널 메타데이터는 `users/{userId}/userHairConsultationChatChannels`에 저장됩니다.

### 상태 관리

- **서버 상태**: TanStack Query (`QueryProvider`로 감싸져 있음)
- **클라이언트/UI 상태**: Zustand 스토어
- **폼 상태**: React Hook Form + Zod 유효성 검사 (일부 TanStack Form 사용)
- **전역 오버레이**: `OverlayContext` + `src/shared/lib/global-overlay.ts`

### 주요 공통 유틸리티

- `src/shared/lib/routes.ts` — 타입이 지정된 `ROUTES` 상수 및 `createNavigation` 팩토리
- `src/shared/lib/auth.ts` — 사용자 데이터, 토큰, 가이드 상태, 지역 관련 localStorage 헬퍼
- `src/shared/constants/search-params.ts` — URL 쿼리 파라미터 키 상수
- `src/shared/lib/navigation.ts` — Next.js 라우터를 감싼 `useNavigation()` 훅

### SVG 임포트

SVG 파일은 `@svgr/webpack`을 통해 React 컴포넌트로 import합니다:

```tsx
import ArrowIcon from '@/assets/icons/arrow-up.svg';
```

### 경로 별칭

`@`는 `src/`를 가리킵니다. `tsconfig.json`과 `vitest.config.ts` 양쪽에 설정되어 있습니다.
