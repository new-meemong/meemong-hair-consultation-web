# 헤어컨설팅 채팅 게시물 버튼 추가 로직 기획

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
  postId?: string; // 게시물 ID
  answerId?: string; // 컨설팅 답변 ID (있는 경우)
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
  postId?: string;
  answerId?: string;
  entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';
}
```

### 3.2 채팅 시작 시 게시물 정보 저장

#### 3.2.1 네이티브 앱에서 채팅 시작 시

- 네이티브 앱에서 `openChatChannel` 호출 시 `postId`, `answerId`, `entrySource` 파라미터 추가
- 채널 생성/찾기 시 해당 정보를 채널에 저장

#### 3.2.2 웹에서 채팅 시작 시

- 게시물 상세 페이지에서 채팅 시작: `postId` 전달
- 컨설팅 답변 페이지에서 채팅 시작: `postId`, `answerId` 전달
- 프로필 페이지에서 채팅 시작: `entrySource: 'PROFILE'` 전달

#### 3.2.3 채널 생성/업데이트 로직 수정

**중요**: 기존 채널이 있어도 새로운 `postId`가 전달되면 채널 정보를 업데이트해야 합니다.
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

      // 1. 삭제 여부 확인 및 재활성화 로직 (기존 로직 유지)
      // ... (기존 재활성화 로직)

      // 2. 새로운 게시물 정보가 있고, 기존 정보와 다르다면 업데이트
      if (postId && existingData.postId !== postId) {
        // 채널 정보 업데이트
        transaction.update(channelRef, {
          postId,
          answerId: answerId || null,
          entrySource: entrySource || null, // 통계용
          updatedAt: serverTimestamp(),
        });

        // 참여자들의 메타데이터도 업데이트 (UserHairConsultationChatChannelType)
        // 참고: getDbPath(userId)는 `users/${userId}/userHairConsultationChatChannels` 경로 반환
        // 트랜잭션 내에서 채널과 메타데이터를 동시에 업데이트하여 데이터 일관성 보장
        const participantRefs = participantIds.map((userId) =>
          doc(db, getDbPath(userId), channelRef.id)
        );

        participantRefs.forEach((ref) => {
          transaction.update(ref, {
            postId,
            answerId: answerId || null,
            entrySource: entrySource || null, // 통계용
            updatedAt: serverTimestamp(),
          });
        });

        // 참고: 동시 업데이트 시나리오는 Firestore 트랜잭션으로 원자성 보장
        // 마지막 업데이트가 적용되는 것이 의도된 동작 (최신 게시물로 채팅 시작)
      }

      return { channelId: channelRef.id, isCreated: false };
    }

    // 새 채널 생성 (기존 로직)
    const newChannel: Omit<HairConsultationChatChannelType, 'id'> = {
      channelKey,
      participantsIds: participantIds,
      channelOpenUserId: senderId,
      postId: postId || null,
      answerId: answerId || null,
      entrySource: entrySource || null, // 통계용
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    transaction.set(channelRef, newChannel);

        // 참여자별 메타데이터 생성 시에도 게시물 정보 포함
        // 참고: getDbPath(userId)는 `users/${userId}/userHairConsultationChatChannels` 경로 반환
        participantIds.forEach((userId) => {
          const userMetaRef = doc(db, getDbPath(userId), channelRef.id);
          // ... 기존 로직
          const useMeta: UserHairConsultationChatChannelType = {
            // ... 기존 필드들
            postId: postId || null,
            answerId: answerId || null,
            entrySource: entrySource || null, // 통계용
            // ... 나머지 필드들
          };
          transaction.set(userMetaRef, useMeta);
        });

    return { channelId: channelRef.id, isCreated: true };
  });

  return result;
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

#### 3.3.3 채팅 화면에 버튼 추가

```typescript
// src/app/chat/hair-consultation/[id]/page.tsx
<SiteHeader
  showBackButton
  title={userChannel?.otherUser?.DisplayName ?? ''}
  rightComponent={
    <ChatDetailMoreButton chatChannel={userChannel} onLeaveChat={handleBackClick} />
  }
  onBackClick={handleBackClick}
/>
{/* 게시물 버튼 추가 - postId가 있을 때만 표시 */}
{userChannel?.postId && (
  <ChatPostButtons
    postId={userChannel.postId}
    answerId={userChannel.answerId}
    // entrySource는 통계용으로만 전달 (버튼 활성화에는 사용하지 않음)
  />
)}
<MessageSection userChannel={userChannel} />
```

### 3.4 API 호출 및 데이터 확인

#### 3.4.1 게시물 정보 조회

- `useGetPostDetail` 훅 사용하여 게시물 정보 조회
- 작성자 ID 확인: `postDetail.hairConsultPostingCreateUserId`
- 컨설팅 답변 존재 여부: `postDetail.isAnsweredByDesigner`

#### 3.4.2 컨설팅 답변 ID 확인 및 유효성 체크

- `userChannel.answerId`가 있으면 해당 답변으로 이동
- **유효성 체크**: 저장된 `answerId`가 실제로 게시물의 컨설팅 답변 목록에 존재하는지 확인
- 유효하지 않은 경우 (답변이 삭제되었거나 존재하지 않는 경우) 답변 보기 버튼 비활성화
- `answerId`가 없는 경우, 게시물의 첫 번째 컨설팅 답변 찾기 (필요시)

### 3.5 버튼 활성화 로직 (단순화)

**중요 변경사항**: `entrySource`는 통계 및 분석용으로만 사용하고, 버튼 활성화에는 사용하지 않습니다.
진입 경로와 상관없이 `postId` 존재 여부와 `isPostWriter` 속성만으로 판단합니다.

#### 3.5.1 단순화된 로직

```typescript
// 진입 경로와 무관하게 관계 기반으로 판단
// 1. 채널에 연결된 게시물이 없는 경우
if (!userChannel?.postId) {
  return {
    showOriginalPost: false,
    showResponse: false,
    showReservation: true,
  };
}

// 2. 게시물 정보 조회
const { data: postDetail } = useGetPostDetail(userChannel.postId);
const isPostWriter = postDetail?.hairConsultPostingCreateUserId === user.id;
const hasConsultingResponse = postDetail?.isAnsweredByDesigner ?? false;

// 3. answerId 유효성 체크
const isValidAnswerId =
  userChannel.answerId &&
  postDetail?.consultingResponses?.some(
    (response) => response.id.toString() === userChannel.answerId,
  );

// 4. 버튼 활성화 결정
const showOriginalPostButton = isPostWriter; // 내 글인 경우만
const showResponseButton = isPostWriter && hasConsultingResponse && isValidAnswerId;
const showReservationButton = true; // 항상 활성화
```

#### 3.5.2 케이스별 동작 예시

| 케이스 | 조건                                                     | 원글 보기 | 답변 보기 | 매장예약 |
| ------ | -------------------------------------------------------- | --------- | --------- | -------- |
| 1-3    | `postId` 없음                                            | X         | X         | O        |
| 4      | `postId` 있음 + 내 글 + 답변 있음 + `answerId` 유효      | O         | O         | O        |
| 5      | `postId` 있음 + 내 글 + 답변 있음 + `answerId` 유효      | O         | O         | O        |
| 6-7    | `postId` 있음 + 내 글 + (답변 없음 또는 `answerId` 무효) | O         | X         | O        |
| 기타   | `postId` 있음 + 남의 글                                  | X         | X         | O        |

**장점**:

- 프로필을 통해 채팅방에 재진입해도 (Case 5) 올바르게 동작
- 진입 경로와 상관없이 일관된 동작 보장
- 로직이 단순하고 유지보수 용이

## 4. 구현 단계

### Phase 1: 데이터 구조 확장

1. `HairConsultationChatChannelType`에 게시물 정보 필드 추가
2. `UserHairConsultationChatChannelType`에 게시물 정보 필드 추가
3. 채널 생성/업데이트 로직에 게시물 정보 저장 추가

### Phase 2: 채팅 시작 시 게시물 정보 전달

1. 네이티브 앱 `openChatChannel` 인터페이스 확장 (필요시)
2. 웹에서 채팅 시작 시 게시물 정보 전달 로직 추가
3. 채널 생성 시 게시물 정보 저장 로직 구현

### Phase 3: 게시물 버튼 UI 구현

1. `ChatPostButtons` 컴포넌트 생성
2. 버튼 활성화 로직 구현
3. 게시물/답변 페이지 이동 로직 구현
4. 매장예약 링크 처리 로직 구현

### Phase 4: 통합 및 테스트

1. 채팅 화면에 버튼 추가
2. 각 케이스별 테스트
3. 에러 처리 및 엣지 케이스 처리

## 5. 고려사항

### 5.1 기존 채팅 채널 처리 및 업데이트

- 기존 채팅 채널에는 게시물 정보가 없을 수 있음
- `postId`가 없는 경우 버튼을 표시하지 않음
- **중요**: 같은 사용자 조합의 채팅방은 하나만 유지하되, 새로운 게시물로 채팅을 시작하면 채널의 게시물 정보가 업데이트됨
  - 예: 게시물 A로 채팅 시작 → 게시물 B로 다시 채팅 시작 → 채널의 `postId`가 B로 업데이트
  - 이렇게 하면 유저가 다른 게시물을 올리고 채팅을 다시 시작해도 최신 게시물 버튼이 표시됨

### 5.2 네이티브 앱 연동

- 네이티브 앱에서 채팅 시작 시 게시물 정보를 전달받을 수 있는지 확인 필요
- 전달받지 못하는 경우, 채팅 시작 후 게시물 정보를 조회하는 방법 고려

#### 5.2.1 window.openChatChannel 인터페이스 확장

**현재 구조**:

```typescript
window.openChatChannel({
  userId: string;
  chatChannelId: string;
});
```

**확장 제안**:

```typescript
window.openChatChannel({
  userId: string;
  chatChannelId: string;
  postId?: string; // 추가
  answerId?: string; // 추가
  entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR'; // 추가
});
```

**네이티브 팀 협의 필요**:

- 네이티브 앱에서 채팅 시작 시 `postId`, `answerId`, `entrySource`를 전달할 수 있는지 확인
- 전달 가능한 경우: 채널 생성/업데이트 시 해당 정보 저장
- 전달 불가능한 경우: 채팅 시작 후 게시물 정보를 조회하는 대안 로직 필요

### 5.3 성능 최적화

- 게시물 정보는 필요할 때만 조회 (버튼 표시 조건 확인 후)
- 메모이제이션 활용하여 불필요한 리렌더링 방지

#### 5.3.1 useGetPostDetail 캐싱 전략

- React Query의 기본 캐싱 활용
- `staleTime` 설정으로 불필요한 재요청 방지
- `enabled` 옵션으로 `postId`가 있을 때만 요청

```typescript
const { data: postDetail } = useGetPostDetail(userChannel?.postId ?? '', {
  enabled: !!userChannel?.postId, // postId가 있을 때만 요청
  staleTime: 5 * 60 * 1000, // 5분간 캐시 유지
});
```

#### 5.3.2 불필요한 API 호출 방지

- `postId`가 없는 경우 게시물 정보 조회하지 않음
- 게시물 정보 조회 실패 시 재시도 로직 제한
- 컴포넌트 메모이제이션으로 리렌더링 최소화

### 5.4 에러 처리

- 게시물 정보 조회 실패 시 버튼 숨김 처리
- 게시물이 삭제된 경우 처리
- `answerId`가 유효하지 않은 경우 (답변이 삭제되었거나 존재하지 않는 경우) 답변 보기 버튼 비활성화

#### 5.4.1 게시물 삭제 시나리오 처리

**정책 결정 필요**: 게시물이 삭제된 경우 채널의 `postId`를 어떻게 처리할지 결정해야 합니다.

**옵션 1: postId 유지 (권장)**

- 채널의 `postId`는 그대로 유지
- 게시물 조회 실패 시 버튼만 숨김 처리
- 장점: 채팅 히스토리와의 연결성 유지, 통계 분석 가능
- 단점: 삭제된 게시물 ID가 남아있음

**옵션 2: postId 초기화**

- 게시물 조회 실패 시 채널의 `postId`를 `null`로 업데이트
- 장점: 데이터 정리
- 단점: 채팅 히스토리와의 연결성 상실, 추가 업데이트 로직 필요

**구현 예시 (옵션 1 기준)**:

```typescript
const { data: postDetail, error } = useGetPostDetail(userChannel.postId ?? '');

// 게시물이 삭제되었거나 조회 실패한 경우
if (error || !postDetail) {
  // 버튼만 숨김 처리, postId는 유지
  return {
    showOriginalPost: false,
    showResponse: false,
    showReservation: true, // 매장예약은 여전히 가능
  };
}
```

## 6. 추가 고려사항

### 6.1 매장예약 링크

- 디자이너 프로필에서 예약 링크 정보 가져오기
- `userChannel.otherUser`에서 예약 링크 정보 확인 필요

#### 6.1.1 예약 링크 처리 로직

**확인 필요**: `userChannel.otherUser`에 예약 링크 정보가 포함되어 있는지 확인

**옵션 1: otherUser에 예약 링크 포함**

- `otherUser.reservationLink` 또는 유사 필드 확인
- 링크가 있으면 버튼 활성화, 없으면 비활성화 또는 숨김

**옵션 2: 별도 API 호출**

- 디자이너 프로필 API 호출하여 예약 링크 조회
- 성능 고려하여 필요시에만 호출

**구현 예시**:

```typescript
// otherUser에 예약 링크가 포함되어 있다고 가정
const reservationLink = userChannel.otherUser?.reservationLink;

const showReservationButton = !!reservationLink; // 링크가 있을 때만 활성화

// 또는 항상 활성화하되, 링크가 없으면 모달 표시
const handleReservationClick = () => {
  if (!reservationLink) {
    showModal({
      id: 'no-reservation-link-modal',
      text: '예약 링크가 등록되지 않았습니다.',
      buttons: [{ label: '확인' }],
    });
    return;
  }
  openUrlInApp(reservationLink);
};
```

### 6.2 컨설팅 답변 ID

- `answerId`가 없는 경우, 게시물의 첫 번째 컨설팅 답변 찾기
- 또는 답변 보기 버튼을 비활성화

### 6.3 진입 경로 추적

- `entrySource`는 통계 및 분석용으로만 저장
- 버튼 활성화 로직에는 사용하지 않음 (3.5.1 참고)
- 향후 분석을 위해 진입 경로 정보 저장
- 통계 및 분석에 활용 가능

## 7. 추가 고려사항 (피드백 반영)

### 7.1 데이터 일관성 확인

#### 7.1.1 getDbPath 경로 검증

**확인 완료**: 기존 코드에서 `getDbPath` 함수가 정확히 정의되어 있음

```typescript
// src/features/chat/lib/get-db-path.ts
export function getDbPath(userId: string) {
  return `users/${userId}/userHairConsultationChatChannels`;
}
```

**채널 업데이트 시 경로 사용**:

- 채널 메타데이터 경로: `users/{userId}/userHairConsultationChatChannels/{channelId}`
- 트랜잭션 내에서 동일한 경로 사용하여 일관성 보장
- 기존 코드 패턴과 동일하게 구현

### 7.2 경쟁 조건(Race Condition) 처리

#### 7.2.1 동시 업데이트 시나리오

**문제**: 같은 채널에 여러 사용자가 동시에 다른 게시물로 업데이트를 시도하는 경우

**현재 설계**:

- Firestore 트랜잭션 사용으로 원자성 보장
- 마지막 업데이트가 덮어쓰는 방식 (의도된 동작)

**고려사항**:

- 사용자 A가 게시물 1로 채팅 시작
- 사용자 B가 동시에 게시물 2로 채팅 시작
- 결과: 마지막 업데이트가 적용됨 (게시물 2)

**대안 제안** (필요시):

- `channelOpenUserId`를 기준으로 업데이트 권한 부여
- 또는 타임스탬프 기반으로 최신 업데이트만 적용
- 현재는 마지막 업데이트 방식이 적절함 (사용자가 최신 게시물로 채팅을 시작하는 것이 자연스러움)

### 7.3 버튼 UI/UX

#### 7.3.1 버튼 배치 위치

**제안**: 헤더 바로 아래, 메시지 영역 위에 배치

```typescript
<SiteHeader ... />
{/* 게시물 버튼 영역 */}
{userChannel?.postId && (
  <div className="px-4 py-3 bg-white border-b border-label-disable">
    <ChatPostButtons ... />
  </div>
)}
<MessageSection userChannel={userChannel} />
```

**이유**:

- 헤더와 메시지 영역 사이에 위치하여 접근성 좋음
- 스크롤 시에도 고정되어 있으면 좋을 수 있음 (선택사항)

#### 7.3.2 버튼 디자인

**제안**:

- 버튼 스타일: 기존 `Button` 컴포넌트 활용
- 레이아웃: 가로 배치 또는 세로 배치 (모바일 고려)
- 아이콘: 각 버튼에 적절한 아이콘 추가 (선택사항)

```typescript
<div className="flex gap-2">
  {showOriginalPostButton && (
    <Button theme="whiteBorder" onClick={handleOriginalPostClick}>
      원글 보기
    </Button>
  )}
  {showResponseButton && (
    <Button theme="whiteBorder" onClick={handleResponseClick}>
      답변 보기
    </Button>
  )}
  {showReservationButton && (
    <Button onClick={handleReservationClick}>
      매장예약
    </Button>
  )}
</div>
```

#### 7.3.3 모바일 반응형 처리

- 버튼 크기: 모바일 화면에 맞게 조정
- 텍스트 길이: 긴 텍스트는 줄바꿈 또는 축약
- 터치 영역: 최소 44x44px 확보

### 7.4 테스트 시나리오

#### 7.4.1 케이스별 E2E 테스트

1. **케이스 1-3**: 프로필에서 채팅 시작 → 버튼 확인 (원글 X, 답변 X, 예약 O)
2. **케이스 4**: 내 글의 컨설팅 답변에서 채팅 시작 → 버튼 확인 (원글 O, 답변 O, 예약 O)
3. **케이스 5**: 프로필에서 재진입 (내 글 + 답변 있음) → 버튼 확인 (원글 O, 답변 O, 예약 O)
4. **케이스 6-7**: 프로필에서 재진입 (내 글 + 답변 없음) → 버튼 확인 (원글 O, 답변 X, 예약 O)
5. **게시물 업데이트**: 게시물 A로 채팅 → 게시물 B로 다시 채팅 → 버튼이 B로 업데이트되는지 확인

#### 7.4.2 에러 상황 테스트

1. **게시물 삭제**: 삭제된 게시물 ID로 채팅 → 버튼 숨김 처리 확인
2. **답변 삭제**: 삭제된 answerId가 저장된 경우 → 답변 보기 버튼 비활성화 확인
3. **네트워크 오류**: 게시물 정보 조회 실패 → 에러 처리 확인
4. **권한 없음**: 다른 사용자의 게시물 → 원글/답변 버튼 비활성화 확인

#### 7.4.3 성능 테스트

1. **API 호출 최소화**: `postId`가 없을 때 API 호출하지 않는지 확인
2. **캐싱 동작**: 같은 게시물 정보를 여러 번 조회하지 않는지 확인
3. **리렌더링 최소화**: 불필요한 리렌더링이 발생하지 않는지 확인
