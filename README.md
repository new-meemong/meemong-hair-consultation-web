# 미몽 헤어상담 웹

Flutter 앱에 임베드되어 모델의 헤어상담 요청과 디자이너의 상담 답변, 관련 채팅을 제공하는 Next.js 웹뷰입니다.

## 주요 기능

- 모델 헤어상담 작성 및 조회
- 디자이너 상담 답변 작성 및 조회
- 상담 댓글과 실시간 채팅
- Flutter 앱 브리지 기반 화면 이동과 외부 링크 처리

## 문서

- [문서 안내](./docs/README.md)
- [기능 문서](./docs/features/)
- [데이터베이스 문서](./docs/database/)
- [아키텍처 문서](./docs/architecture.md)

## 기술 스택

- Next.js 15
- React 19
- TypeScript 5
- Tailwind CSS 4
- TanStack Query
- Zustand
- Firebase
- Vitest

## 실행 환경

- Node.js 22.x
- npm

## 시작하기

```bash
npm ci
npm run dev
```

개발 서버는 기본적으로 `http://localhost:3002`에서 실행됩니다.

## 검증 및 빌드

```bash
npm run test -- --run
npm run lint
npm run build
```

프로덕션 빌드 실행:

```bash
npm run start
```

에이전트용 프로젝트 규칙은 [AGENTS.md](./AGENTS.md)를 참고합니다.
