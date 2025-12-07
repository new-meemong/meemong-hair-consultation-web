# 헤어컨설팅 채팅 게시물 버튼 추가 로직

## 1. 현재 구조 분석

### 1.1 채팅 채널 타입

- `HairConsultationChatChannelType`: 기본 채널 정보만 포함 (게시물 정보 없음)
- `UserHairConsultationChatChannelType`: 사용자별 채널 메타데이터 (게시물 정보 없음)

### 1.2 채팅 시작 경로

1. **네이티브 앱에서 시작**: `window.openChatChannel` 호출
2. **웹에서 시작**: 채팅 리스트에서 채널 클릭
3. **게시물/프로필에서 시작**: 현재 코드에서 명시적으로 찾지 못함 (네이티브에서 처리 가능성)

### 1.3 채팅 화면 구조

- 경로: `/chat/hair-consultation/[id]`
- 컴포넌트: `HairConsultationChatDetailPage`
- 헤더: `SiteHeader` (제목, 뒤로가기, 더보기 버튼)
- 메시지 영역: `MessageSection`
- 입력 영역: `ChatMessageForm`

## 2. 요구사항 정리

### 2.1 버튼 종류

- **원글 보기**: 게시물 상세 페이지로 이동
- **답변 보기**: 컨설팅 답변 페이지로 이동
- **매장예약**: 예약 링크 (항상 활성화)

### 2.2 버튼 활성화 조건

| 케이스 | 최초 경로 | 다음 경로                                                                       | 원글 보기 | 답변 보기 | 매장예약 |
| ------ | --------- | ------------------------------------------------------------------------------- | --------- | --------- | -------- |
| 1      | 상담왕    | 프로필 페이지에서 채팅 클릭                                                     | X         | X         | O        |
| 2      | 남의 글   | 컨설팅 답변에서 채팅 클릭                                                       | X         | X         | O        |
| 3      | -         | 프로필사진 등 클릭해서 프로필 진입 후 채팅 클릭                                 | X         | X         | O        |
| 4      | 내 글     | 컨설팅 답변에서 채팅 클릭                                                       | O         | O         | O        |
| 5      | -         | 프로필사진 등 클릭해서 프로필 진입 후 채팅 클릭 (내 글에 컨설팅 답변 있는 경우) | O         | O         | O        |
| 6      | -         | 프로필사진 등 클릭해서 프로필 진입 후 채팅 클릭 (내 글에 컨설팅 답변 없는 경우) | O         | X         | O        |
| 7      | -         | 일반 댓글인 경우                                                                | O         | X         | O        |

### 2.3 핵심 로직

- **원글 보기**: 내가 작성한 글인 경우만 활성화
- **답변 보기**: 내가 작성한 글 + 컨설팅 답변이 있는 경우만 활성화
- **매장예약**: 항상 활성화

## 3. 구현 방안

### 3.1 데이터 구조 확장

#### 3.1.1 채팅 채널 타입에 게시물 정보 추가

```typescript
// src/features/chat/type/hair-consultation-chat-channel-type.ts
export interface HairConsultationChatChannelType {
  id: string;
  channelKey: string;
  participantsIds: string[];
  channelOpenUserId: string;

  // 추가: 게시물 관련 정보
  postId?: string | null; // 게시물 ID (null: 다른 사람 글에서 채팅 시작한 경우)
  answerId?: string | null; // 컨설팅 답변 ID (null: 답변이 없는 경우)
  entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR'; // 진입 경로

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  otherUser?: User;
}
```

#### 3.1.2 사용자 채널 메타데이터에도 추가

```typescript
// src/features/chat/type/user-hair-consultation-chat-channel-type.ts
export interface UserHairConsultationChatChannelType {
  // ... 기존 필드들

  // 추가: 게시물 관련 정보 (채널과 동일하게 저장)
  postId?: string | null;
  answerId?: string | null;
  entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';
}
```

### 3.2 채팅 시작 시 게시물 정보 저장

#### 3.2.1 채팅 시작 시나리오별 postId, answerId 설정

1. **내 컨설팅 게시글의 일반 댓글에서 디자이너 프로필로 넘어가서 채팅 시작**
   - `postId`: 해당 내 컨설팅 게시글 전달
   - `answerId`: 해당 디자이너가 내 컨설팅 게시글에 컨설팅 답변이 있으면 그 답변 ID, 없으면 `null`

2. **내 컨설팅 게시글의 컨설팅 댓글에서 디자이너 프로필로 넘어가서 채팅 시작**
   - `postId`: 해당 내 컨설팅 게시글 전달
   - `answerId`: 해당 디자이너가 내 컨설팅 게시글에 단 컨설팅 답변 ID

3. **다른 사람의 컨설팅 게시글에서 디자이너 프로필로 넘어가서 채팅 시작**
   - `postId`: `null`
   - `answerId`: `null`

4. **다른 사람의 컨설팅 게시글의 컨설팅 답변 페이지에서 채팅 시작**
   - `postId`: `null`
   - `answerId`: `null`

#### 3.2.2 채널 생성/업데이트 로직

**중요**: 기존 채널이 있어도 새로운 `postId`나 `answerId`가 전달되면 채널 정보를 업데이트해야 합니다.
같은 사용자 조합의 채팅방은 하나만 유지하되, 현재 주제(Context)인 게시물 정보는 최신 것으로 갱신됩니다.

```typescript
// src/features/chat/store/hair-consultation-chat-channel-store.ts
findOrCreateChannel: async ({
  senderId,
  receiverId,
  postId?, // 추가
  answerId?, // 추가
  entrySource?, // 추가 (통계용, 버튼 활성화에는 사용하지 않음)
}) => {
  // ... 기존 로직 (participantIds 정렬, channelKey 생성 등)

  const result = await runTransaction(db, async (transaction) => {
    const channelSnapshot = await transaction.get(channelRef);

    if (channelSnapshot.exists()) {
      // 기존 채널이 존재하는 경우
      const existingData = channelSnapshot.data();

      // postId 또는 answerId가 변경된 경우 업데이트
      const existingPostId = existingData.postId ?? null;
      const existingAnswerId = existingData.answerId ?? null;
      const newPostId = postId !== undefined ? (postId || null) : existingPostId;
      const newAnswerId = answerId !== undefined ? (answerId || null) : existingAnswerId;

      const postIdChanged = existingPostId !== newPostId;
      const answerIdChanged = existingAnswerId !== newAnswerId;
      const entrySourceChanged = entrySource && existingData.entrySource !== entrySource;

      if (postIdChanged || answerIdChanged || entrySourceChanged) {
        // 채널 정보 업데이트
        const updateData = {
          ...(postId !== undefined && { postId: postId || null }),
          ...(answerId !== undefined && { answerId: answerId || null }),
          ...(entrySource && { entrySource }),
          updatedAt: serverTimestamp(),
        };

        transaction.update(channelRef, updateData);

        // 참여자들의 메타데이터도 업데이트
        participantRefs.forEach((ref) => {
          transaction.update(ref, updateData);
        });
      }

      return { channelId: channelRef.id, isCreated: false };
    }

    // 새 채널 생성
    // ...
  });
}
```

### 3.3 채팅 화면에 게시물 버튼 추가

#### 3.3.1 버튼 컴포넌트 생성

```typescript
// src/features/chat/ui/chat-post-buttons.tsx
// 원글 보기, 답변 보기, 매장예약 버튼을 포함하는 컴포넌트
```

#### 3.3.2 버튼 활성화 로직

**핵심 원칙**: `entrySource`는 통계용으로만 사용하고, 버튼 활성화는 `postId` 존재 여부와 `isPostWriter` 속성만으로 판단합니다.

```typescript
// 채팅 화면에서 사용
const { userChannel } = ...;
const { user } = useAuthContext();

// 1. 채널에 연결된 게시물이 없는 경우 (Case 1, 2, 3 등)
if (!userChannel?.postId) {
  return {
    showOriginalPost: false,
    showResponse: false,
    showReservation: true, // 매장예약은 항상 활성화
  };
}

// 2. 게시물 정보 조회
const { data: postDetail } = useGetPostDetail(userChannel.postId);

// 3. 작성자 확인 (진입 경로 무관, 관계 기반 판단)
const isPostWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

// 4. 컨설팅 답변 존재 여부 확인
const hasConsultingResponse = postDetail?.isAnsweredByDesigner ?? false;

// 5. answerId 유효성 체크 (저장된 answerId가 실제로 존재하는지 확인)
const isValidAnswerId = userChannel.answerId &&
  postDetail?.consultingResponses?.some(
    (response) => response.id.toString() === userChannel.answerId
  );

// 6. 버튼 활성화 여부 결정 (진입 경로 무관, 관계 기반)
const showOriginalPostButton = isPostWriter; // 내 글인 경우만
const showResponseButton = isPostWriter && hasConsultingResponse && isValidAnswerId; // 내 글 + 답변 있음 + 유효한 answerId
const showReservationButton = true; // 항상 활성화
```

## 4. 주요 파일

- `src/features/chat/ui/chat-post-buttons.tsx` - 버튼 컴포넌트
- `src/features/chat/store/hair-consultation-chat-channel-store.ts` - 채널 생성/업데이트 로직
- `src/features/chat/hook/use-start-chat.ts` - 채팅 시작 훅
- `src/features/comments/ui/comment-author-profile.tsx` - 댓글에서 프로필 이동
- `src/features/posts/ui/consulting-response/consulting-response-header.tsx` - 컨설팅 답변 페이지

## 5. 테스트 시나리오

### 5.1 케이스별 테스트

1. **케이스 1-3**: 프로필에서 채팅 시작 → 버튼 확인 (원글 X, 답변 X, 예약 O)
2. **케이스 4**: 내 글의 컨설팅 답변에서 채팅 시작 → 버튼 확인 (원글 O, 답변 O, 예약 O)
3. **케이스 5**: 프로필에서 재진입 (내 글 + 답변 있음) → 버튼 확인 (원글 O, 답변 O, 예약 O)
4. **케이스 6-7**: 프로필에서 재진입 (내 글 + 답변 없음) → 버튼 확인 (원글 O, 답변 X, 예약 O)
5. **게시물 업데이트**: 게시물 A로 채팅 → 게시물 B로 다시 채팅 → 버튼이 B로 업데이트되는지 확인

### 5.2 에러 상황 테스트

1. **게시물 삭제**: 삭제된 게시물 ID로 채팅 → 버튼 숨김 처리 확인
2. **답변 삭제**: 삭제된 answerId가 저장된 경우 → 답변 보기 버튼 비활성화 확인
3. **네트워크 오류**: 게시물 정보 조회 실패 → 에러 처리 확인
4. **권한 없음**: 다른 사용자의 게시물 → 원글/답변 버튼 비활성화 확인
