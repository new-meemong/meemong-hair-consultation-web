---
name: code-review
description: Next.js/TypeScript 코드 리뷰. "리뷰해줘", "코드 봐줘", "점검해줘", "review" 요청 시 호출.
---

# 미몽 헤어컨설팅 웹 코드 리뷰 스킬

## 리뷰 전 필수 확인 사항

파일을 읽기 전에는 어떤 아키텍처 주장도 하지 않는다.
특히 아래 항목은 반드시 직접 파일을 Read한 뒤 언급한다:

- 라우트 구조 → `src/app/(webview)/` 디렉토리 구조 먼저 확인
- API 클라이언트 패턴 → `src/shared/api/client.ts` 확인 (`apiClient` vs `apiClientWithoutAuth`)
- 에러 처리 방식 → 해당 API 훅 파일 직접 확인 (`src/features/<도메인>/api/`)
- 인증 흐름 → `src/features/auth/context/auth-context.tsx` 확인
- FSD 레이어 경계 → 실제 import 경로 확인 (`app` > `widgets` > `features` > `entities` > `shared`)

## 리뷰 형식

각 지적 사항은 아래 형식으로 작성한다:

```
[P1 버그 | P2 설계 약점 | P3 개선 제안]
위치: file_path:line_number
문제: (무엇이 왜 문제인가)
제안: (구체적인 코드 수준의 개선 방향)
```

Severity 기준:
- **P1 버그**: 실제로 터질 수 있는 크래시, 데이터 손실, 채팅/결제 오동작, XSS·SQL인젝션 등 보안 취약점
- **P2 설계 약점**: 실현 가능한 엣지 케이스, 정책 비대칭, 레이어 경계 위반, 구조적 취약점
- **P3 개선 제안**: 가독성, 네이밍, 단순화, 불필요한 복잡도

## Gotchas — 이 프로젝트에서 반복된 실수 목록

### G1. Server Component / Client Component 경계 미확인 상태에서 지적
- **금지**: 파일 상단의 `"use client"` 여부를 확인하지 않고 "서버 컴포넌트에서 useState를 쓰면 안 된다" 같은 지적
- **대신**: 해당 파일의 `"use client"` 여부를 직접 확인한 뒤 지적한다

### G2. App Router 라우트 구조 미확인 상태에서 라우팅 지적
- **금지**: "`useSearchParams()`가 Suspense 없이 사용됐다" 같은 지적을 라우트 구조 확인 없이 올리는 것
- **대신**: `src/app/(webview)/` 디렉토리 구조를 확인하고 해당 페이지가 어떤 레이아웃 하위인지 명시 후 지적

### G3. 에러 처리 인프라 무시한 에러 타입 제안
- **금지**: 현재 인프라가 `ky`의 `HTTPError` 기반인데 커스텀 에러 클래스로 교체하자는 제안
- **대신**: `src/shared/api/client.ts`의 실제 에러 처리 구조를 확인 → 인프라가 없으면 단기(현재 구조 내 개선)/장기(타입드 에러 도입) 방향 분리 제안

### G4. TanStack Query 캐시 무효화 누락 단정
- **금지**: mutation 후 `queryClient.invalidateQueries()` 없다고 단정적으로 버그로 올리는 것
- **대신**: 해당 뮤테이션이 실제로 캐시를 오염시키는 시나리오인지, UI 낙관적 업데이트로 이미 처리됐는지 확인 후 지적

### G5. Flutter 브릿지 호출 검증 없이 지적
- **금지**: `window.goAppRouter`, `window.closeWebview` 등 Flutter 채널 호출이 "undefined일 수 있다"며 단순 null-check 제안만 올리는 것
- **대신**: `src/app/layout.tsx`에서 해당 채널이 어떻게 선언되어 있는지 확인하고, 실제로 undefined가 될 수 있는 시나리오(Flutter 로드 전 호출 등)를 구체적으로 명시

### G6. NEXT_PUBLIC_API_URL 테스트 서버 언급
- **금지**: `.env.local` 혹은 환경변수에서 `NEXT_PUBLIC_API_URL`이 개발 서버로 설정되어 있다고 지적
- **이유**: 개발 중 의도적 설정이므로 불필요한 노이즈

### G7. P2 과분류 금지
- **금지**: 이미 방어 로직이 있어 동작상 문제없는 코드를 P2로 올리는 것
- **대신**: 방어 로직이 존재하면 기본은 P3로 시작. 실제 사용자 영향이나 운영 리스크가 분명할 때만 P2로 올린다

### G8. 설계 의도가 있을 수 있는 코드는 분기 제시
- **금지**: 작성자의 설계 의도가 있을 수 있는 코드를 단정적으로 "잘못됐다"고 지적하는 것
- **대신**: "의도가 A라면 유지 가능, B라면 수정 필요" 형태로 분기 제시
- **예시**: Zustand 스토어에서 특정 상태를 전역으로 올린 것은 "여러 컴포넌트에서 공유"라는 의도일 수 있다. 버그가 아니라 의도 문서화 필요 수준.

### G9. FSD 레이어 위반은 import 경로 직접 확인 후 지적
- **금지**: "이 컴포넌트가 FSD 규칙을 위반한 것 같다"며 파일을 직접 읽지 않고 지적하는 것
- **대신**: 실제 import 문을 Read로 확인하고, 어느 레이어에서 어느 상위 레이어를 import했는지 구체적인 경로를 명시

### G10. Firebase Firestore 구독 정리 누락 단정
- **금지**: `onSnapshot` 구독이 cleanup되지 않는다고 단정하는 것
- **대신**: 해당 훅/컴포넌트의 `useEffect` return 절을 직접 확인하고, Zustand 스토어에서 관리하는 경우 스토어의 cleanup 로직도 확인

### G11. 리뷰 말미에 핵심 위험 요약
- **금지**: 모든 지적을 비슷한 무게로 나열하여 핵심이 묻히게 하는 것
- **대신**: 총평에서 반드시 **핵심 위험**을 별도로 요약한다. 1개일 수도 있고 2개 이상 동급일 수도 있다. 나머지는 정리/선택 수준임을 구분

---

## 프롬프트 작성 가이드 (사용자용)

### 기본 형식

```
/code-review

[리뷰 대상 파일 경로 또는 코드 붙여넣기]

컨텍스트:
- 이 코드가 무엇을 하는지 한 줄 설명
- 특히 신경 쓰이는 부분 (있으면)
- 어떤 변경을 방금 했는지 (있으면)
```

### 효과적인 프롬프트 예시

**파일 단위 리뷰:**
```
/code-review

src/features/chat/ui/chat-message-list.tsx 리뷰해줘.
어제 Firebase onSnapshot 구독 방식을 Zustand 스토어로 옮겼어.
특히 메시지 구독 정리(cleanup) 부분이 제대로 됐는지 봐줘.
```

**특정 관심사 지정:**
```
/code-review

[코드]

P1/P2만 봐줘, P3는 생략해도 돼.
```

**비교 리뷰:**
```
/code-review

두 API 훅 비교해줘:
- src/features/consultation/api/use-create-consultation.ts
- src/features/trial/api/use-create-trial.ts

에러 처리 방식이 대칭인지 확인해줘.
```

### 팁

- **컨텍스트를 줄수록 정확도가 오른다**: "이 함수 리뷰해줘"보다 "이 함수에서 X를 추가했는데 Y가 걱정돼"가 훨씬 좋은 결과를 낸다
- **관심사를 좁혀라**: 전체 파일보다 "에러 처리만", "인증 흐름만" 같이 범위를 주면 더 깊은 리뷰가 나온다
- **변경된 부분을 명시해라**: 무엇을 바꿨는지 알면 변경 전후 일관성 검사가 가능하다
