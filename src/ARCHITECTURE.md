# FSD (Feature Sliced Design) 아키텍처

## 개요

이 프로젝트는 Feature Sliced Design 아키텍처 패턴을 따르고 있습니다. FSD는 기능 중심적인 구조로, 모듈화와 확장성을 중요시하는 프론트엔드 아키텍처입니다.

## 주요 레이어

### 1. `app` 레이어

- Next.js의 App Router를 활용한 페이지 구성
- 다른 레이어들의 컴포넌트를 조합하여 완성된 페이지 구성
- 라우팅 관련 로직만 담당

### 2. `widgets` 레이어

- 비즈니스 로직을 포함한 복잡한 UI 블록
- 여러 features와 entities를 조합하여 구성
- 독립적으로 동작 가능한 UI 모듈 (ex: 채팅 컴포넌트)

### 3. `features` 레이어

- 사용자 상호작용과 관련된 비즈니스 로직
- 특정 기능을 구현하는 컴포넌트와 로직
- 예: 좋아요 기능, 게시글 작성, 댓글 등록 등

### 4. `entities` 레이어

- 비즈니스 엔티티를 표현하는 모델과 컴포넌트
- 데이터 구조와 기본 UI 표현
- 예: User, Post, Comment 등

### 5. `shared` 레이어

- 재사용 가능한 UI 컴포넌트 (`ui`)
- 유틸리티 함수 (`lib`)
- 프로젝트 전체에서 공유되는 타입, 상수 등

## 슬라이스 구조

- `ui`: 컴포넌트
- `model`: 상태 관리 (컨텍스트, 훅 등)
- `api`: 데이터 요청 로직
- `lib`: 유틸리티 함수
- `config`: 설정

## 의존성 규칙

1. 상위 레이어는 하위 레이어만 참조할 수 있습니다:

   ```
   app → widgets → features → entities → shared
   ```

2. 같은 레이어 내에서는 다른 슬라이스를 직접 참조할 수 없습니다.

3. 모든 imports는 절대 경로를 사용합니다.

## Next.js + FSD

- App Router를 사용하여 페이지 구성

## UI 컴포넌트 분류 원칙

UI 컴포넌트는 그 성격과 사용 범위에 따라 다음과 같이 분류합니다:

### 1. `shared/ui`

- 기본 컴포넌트(primitive): `Button`, `Input`, `Textarea`, `Avatar` 등
- 기본 컴포넌트를 확장한 복합 컴포넌트: `Drawer`, `BottomSheet` 등
- 비즈니스 로직이 없는 순수 UI 컴포넌트
- 여러 기능에서 재사용 가능한 컴포넌트

### 2. `features/{feature-name}/ui`

- 비즈니스 로직을 포함하거나 특정 도메인 개념을 표현
- 예: `LikeButton`, `WriteButton` 등

### 3. `widgets/{widget-name}/ui`

- 여러 feature 컴포넌트를 조합한 복합 UI 블록
- 비즈니스 로직보다는 UI 구성과 레이아웃에 중점을 두며, 페이지 단위보다 작은 독립적인 UI 섹션을 구성합니다.
- 예: `CommentList`, `PostList` 등
- CommentList(위젯)는 "댓글들을 어떻게 모아서 보여줄 것인가"를 정의

### 4. `entities/{entity-name}/ui`

- 비즈니스 엔티티를 표현하는 컴포넌트
- 도메인 모델의 데이터를 시각적으로 표현하는 가장 기본적인 UI 컴포넌트로, 비즈니스 로직이나 상태 관리 없이 단순히 데이터를 표시하는 데 집중합니다.
- 예: `CommentCard`, `PostItem` 등
- CommentCard(엔티티)는 "하나의 댓글이 어떻게 생겼는가"를 정의

## 사례

기존 컴포넌트를 확장해 새로운 컴포넌트를 만들 때의 레이어 결정:

1. **공통 UI 확장**: 기본 컴포넌트를 확장했지만 여전히 범용적인 경우 `shared/ui`

   - 예: `drawer.tsx`를 확장한 `bottom-sheet.tsx`

2. **기능 특화 확장**: 기본 컴포넌트를 확장했지만 특정 기능에 특화된 경우 `features`
   - 예: `Toggle`을 확장한 `like-button.tsx`

## 참고 문헌

- [Feature-Sliced Design 공식 문서](https://feature-sliced.design/)
- [(번역) 기능 분할 설계 - 최고의 프런트엔드 아키텍처](https://emewjin.github.io/feature-sliced-design/)
