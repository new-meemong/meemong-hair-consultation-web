# 미몽 헤어상담 웹

## 1. 프로젝트 개요

미몽 헤어상담

- 헤어 스타일 관련 정보와 상담을 제공하는 웹 플랫폼

### 주요 기능

- 모델 게시판
- 디자이너 게시판

## 📚 문서

프로젝트의 상세 문서는 [`docs/`](./docs/README.md) 디렉토리에서 확인할 수 있습니다.

- [기능 문서](./docs/features/) - 주요 기능별 구현 로직
- [데이터베이스 문서](./docs/database/) - Firestore 구조 및 데이터 모델
- [아키텍처 문서](./docs/architecture.md) - 프로젝트 아키텍처 설명

## 2. 기술 스택

- **프레임워크**: Next.js v15
- **UI 라이브러리**: React v19
- **스타일링**: Tailwind CSS v4
- **컴포넌트 라이브러리**: shadcn-ui
- **언어**: TypeScript v5
- **패키지 매니저**: Bun

## 3. 실행 방법

### 실행 환경

- Node.js v21.6.2
- Bun 설치

### 개발 환경 설정

1. 저장소 클론

```bash
git clone https://github.com/new-meemong/meemong-hair-consultation-web.git
cd meemong-hair-consultation-web
```

2. 의존성 설치

```bash
bun install
```

3. 개발 서버 실행

```bash
bun dev
```

### 빌드 및 배포

```bash
# 프로덕션 빌드
bun run build

# 프로덕션 서버 실행
bun start
```
