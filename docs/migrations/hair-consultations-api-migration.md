# 헤어상담 API 마이그레이션 스펙

## 목적

레거시 `hair-consult-postings` API를 신규 `hair-consultations` API로 전면 교체한다. UI와 데이터 계약은 신규 엔드포인트 기준으로 변경하며, 상세 요청/응답 스키마는 백엔드 스펙 제공 시 채운다.

## 범위

- 게시글 (목록/상세/작성/수정)
- 읽음 기록
- 좋아요 (추가/취소)
- 댓글 (조회/작성/수정/삭제) 및 댓글 신고
- 컨설팅 답변 (작성/목록/상세/삭제)
- 상담왕 TOP 리스트 (신규)
- 위 항목과 연결된 UI 및 캐시 의존성

## 현재 API 목록 (코드 기준)

- GET `hair-consult-postings/main` (게시글 목록)
- GET `hair-consult-postings/:postId` (게시글 상세)
- POST `hair-consult-postings` (게시글 작성)
- PUT `hair-consult-postings/:postId` (게시글 수정)
- DELETE `hair-consult-postings/:postId` (게시글 삭제)
- POST `hair-consult-postings/:postId/read` (읽음 기록)
- POST/DELETE `hair-consult-postings/:postId/favorites` (좋아요/취소)
- GET `hair-consult-postings/:postId/comments` (댓글 목록)
- POST `hair-consult-postings/:postId/comments` (댓글 작성)
- PATCH `hair-consult-postings/:postId/comments/:commentId` (댓글 수정)
- DELETE `hair-consult-postings/:postId/comments/:commentId` (댓글 삭제)
- POST `hair-consult-postings/:postId/consulting-answer` (답변 작성)
- GET `hair-consult-postings/:postId/consulting-answer/:answerId` (답변 상세)
- PUT `hair-consult-postings/:postId/consulting-answer/:answerId` (답변 수정)

참고:

- 일부는 훅 사용 코드에서 추정된 목록이므로, 백엔드/QA 트래픽으로 재확인 필요.

## 목표 API (신규)

- GET `/hair-consultations`
- GET `/hair-consultations/:hairConsultationId`
- POST `/hair-consultations`
- PUT `/hair-consultations/:hairConsultationId`
- GET `/hair-consultations/top-advisors`
- POST `/hair-consultations/:hairConsultationId/read`
- POST `/hair-consultations/:hairConsultationId/favorites`
- DELETE `/hair-consultations/:hairConsultationId/favorites`
- GET `/hair-consultations/:hairConsultationId/comments`
- POST `/hair-consultations/:hairConsultationId/comments`
- POST `/hair-consultations/:hairConsultationId/comments/:hairConsultationCommentId/reports`
- PATCH `/hair-consultations/:hairConsultationId/comments/:hairConsultationCommentId`
- DELETE `/hair-consultations/:hairConsultationId/comments/:hairConsultationCommentId`
- POST `/hair-consultations/:hairConsultationId/answers`
- GET `/hair-consultations/:hairConsultationId/answers`
- GET `/hair-consultations/:hairConsultationId/answers/:hairConsultationsAnswerId`
- DELETE `/hair-consultations/:hairConsultationId/answers/:hairConsultationsAnswerId`

## 엔드포인트 매핑 (레거시 -> 신규)

- `GET hair-consult-postings/main` -> `GET /hair-consultations`
- `GET hair-consult-postings/:postId` -> `GET /hair-consultations/:hairConsultationId`
- `POST hair-consult-postings` -> `POST /hair-consultations`
- `PUT hair-consult-postings/:postId` -> `PUT /hair-consultations/:hairConsultationId`
- `POST hair-consult-postings/:postId/read` -> `POST /hair-consultations/:hairConsultationId/read`
- `POST/DELETE hair-consult-postings/:postId/favorites` -> `POST/DELETE /hair-consultations/:hairConsultationId/favorites`
- `GET hair-consult-postings/:postId/comments` -> `GET /hair-consultations/:hairConsultationId/comments`
- `POST hair-consult-postings/:postId/comments` -> `POST /hair-consultations/:hairConsultationId/comments`
- `PATCH hair-consult-postings/:postId/comments/:commentId` -> `PATCH /hair-consultations/:hairConsultationId/comments/:hairConsultationCommentId`
- `DELETE hair-consult-postings/:postId/comments/:commentId` -> `DELETE /hair-consultations/:hairConsultationId/comments/:hairConsultationCommentId`
- `POST hair-consult-postings/:postId/consulting-answer` -> `POST /hair-consultations/:hairConsultationId/answers`
- `GET hair-consult-postings/:postId/consulting-answer/:answerId` -> `GET /hair-consultations/:hairConsultationId/answers/:hairConsultationsAnswerId`
- `PUT hair-consult-postings/:postId/consulting-answer/:answerId` -> (대체 없음; 수정 API 유지 여부 확인 필요)

레거시에 없던 신규 엔드포인트:

- `GET /hair-consultations/top-advisors`
- `GET /hair-consultations/:hairConsultationId/answers`
- `DELETE /hair-consultations/:hairConsultationId/answers/:hairConsultationsAnswerId`
- `POST /hair-consultations/:hairConsultationId/comments/:hairConsultationCommentId/reports`

## 마이그레이션 계획 (단계별)

1. 신규 API 레이어 병행 추가

- `HAIR_CONSULTATION_API_PREFIX = 'hair-consultations'` 추가
- 신규 엔드포인트별 훅/타입 정의
- 레거시 훅은 전환 완료 전까지 유지

2. 도메인 타입 정비

- `Post`, `PostDetail`, `Comment`, `ConsultingResponse`를 신규 응답 스키마에 맞게 교체/확장
- UI 안정화를 위해 필요 시 어댑터 추가

3. UI + 상태 마이그레이션

- 신규 훅으로 교체
- 쿼리 키/캐시 무효화/낙관적 업데이트 재정의
- `consulting-answer` 관련 로직을 `answers` 목록/상세로 전환

4. 신규 기능 반영

- 상담왕 TOP 리스트 UI
- 댓글 신고 플로우/화면

5. 레거시 제거

- `hair-consult-postings` 상수/훅 제거
- 사용하지 않는 타입/어댑터 제거

## 백엔드 상세 필요 항목 (엔드포인트별)

- Path 파라미터
- Query 파라미터
- Request Body 스키마
- Response Body 스키마
- 페이지네이션 방식 (cursor/offset, 키 이름)
- 에러 코드/메시지 포맷
- 사이드 이펙트 (읽음 기록, 알림 등)

## 영향 파일 (초기)

- `src/features/posts/constants/api.ts`
- `src/features/posts/api/*`
- `src/features/comments/api/*`
- `src/entities/posts/api/*`
- `src/entities/posts/model/*`
- `src/entities/comment/*`
- `src/features/posts/ui/*`
- `src/features/posts/hooks/*`

## 리스크 / 오픈 이슈

- 답변 수정 API가 삭제되었는지, 신규 대체 API가 있는지 확인 필요
- 목록 API의 페이지네이션/정렬 키 변경 여부
- ID 타입 변경 여부 (number -> string 등)
- `PostDetail`/`Comment` 필드명/중첩 구조 변경 여부
- 좋아요/읽음 처리 후 카운터 반영 방식

## 테스트 플랜

- 스모크: 목록 -> 상세 -> 좋아요 -> 댓글 -> 답변 플로우
- 페이지네이션: 목록/댓글 커서 동작
- 캐시: 좋아요/댓글 낙관적 업데이트 및 무효화
- 회귀: 레거시 API 참조 제거 확인

## 마이그레이션 요약

- 레거시 `hair-consult-postings`를 신규 `hair-consultations`로 전면 전환한다.
- 게시글/댓글/좋아요/읽음/답변/상담왕 등 주요 기능을 신규 엔드포인트에 매핑한다.
- 신규 레이어를 병행 추가 후 UI와 타입을 단계적으로 교체하고, 최종적으로 레거시를 제거한다.
- 답변 수정 API 등 사라진 기능은 백엔드 확정 스펙 확인이 필요하다.
