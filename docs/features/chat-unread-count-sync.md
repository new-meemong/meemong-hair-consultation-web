# 채팅 안읽은 메시지 수 서버 동기화

## 개요

채팅 기능에서 안읽은 메시지 수(unreadCount)를 Firestore와 서버 양쪽에서 동기화하여 관리합니다. 이를 통해 서버에서도 사용자별 안읽은 메시지 수를 추적하고 관리할 수 있습니다.

## API 명세

### POST /api/v1/chatting-unread-counts

안읽은 메시지 수를 업데이트하는 API입니다.

**Request:**
```typescript
{
  "userId": number,        // 업데이트할 사용자 ID
  "unreadCount": number    // 변경될 값 (음수는 차감, 양수는 합)
}
```

**Response:**
```typescript
{
  "data": {
    "id": number,
    "totalUnreadCount": number,
    "createdAt": string,
    "updatedAt": string,
    "userId": number
  }
}
```

**예시:**
- `{ userId: 12345, unreadCount: 1 }` → 사용자 12345의 unreadCount를 1 증가
- `{ userId: 12345, unreadCount: -5 }` → 사용자 12345의 unreadCount를 5 감소

## 구현된 기능

### 1. 메시지 전송 시 상대방 unreadCount 증가

**위치:** `src/features/chat/hook/use-send-message.ts`

메시지를 전송할 때 상대방의 서버 unreadCount를 1 증가시킵니다.

```typescript
// 메시지 전송 성공 후
await updateChattingUnreadCount(Number(receiverId), 1);
```

**동작 흐름:**
1. Firestore에 메시지 저장
2. Firestore에서 상대방의 unreadCount 1 증가
3. 서버 API 호출하여 상대방의 unreadCount 1 증가

**에러 처리:**
- 서버 동기화 실패 시에도 메시지 전송은 성공 처리
- 콘솔에 에러 로그만 기록

### 2. 채팅방 입장 시 unreadCount 초기화

**위치:** `src/features/chat/store/hair-consultation-chat-channel-store.ts`의 `resetUnreadCount` 함수

채팅방에 입장할 때 해당 채팅방의 unreadCount만큼 서버 값에서 차감합니다.

```typescript
// 현재 unreadCount 값을 읽어옴
const currentUnreadCount = snap.exists() ? snap.data().unreadCount || 0 : 0;

// Firestore 업데이트
await updateDoc(ref, {
  unreadCount: 0,
  updatedAt: serverTimestamp(),
});

// 서버 unreadCount 동기화: 현재 사용자의 unreadCount 감소
if (currentUnreadCount > 0) {
  await updateChattingUnreadCount(Number(userId), -currentUnreadCount);
}
```

**동작 흐름:**
1. Firestore에서 현재 채팅방의 unreadCount 값 읽기
2. Firestore의 unreadCount를 0으로 초기화
3. 서버 API 호출하여 현재 사용자의 unreadCount에서 해당 값만큼 차감

**호출 시점:**
- 채팅방 상세 페이지 입장 시 (`src/app/chat/hair-consultation/[id]/page.tsx`)
- MessageSection 컴포넌트 cleanup 시

### 3. 채팅방 나갈 때 unreadCount 차감

**위치:** `src/features/chat/store/hair-consultation-chat-channel-store.ts`의 `leaveChannel` 함수

채팅방을 나갈 때 해당 채팅방의 unreadCount만큼 서버 값에서 차감합니다.

```typescript
// 현재 unreadCount 값을 읽어옴
const currentUnreadCount = userMetaSnap.exists()
  ? userMetaSnap.data().unreadCount || 0
  : 0;

// ... 채팅방 나가기 처리 ...

// 서버 unreadCount 동기화: 현재 사용자의 unreadCount 감소
if (currentUnreadCount > 0) {
  await updateChattingUnreadCount(Number(userId), -currentUnreadCount);
}
```

**동작 흐름:**
1. Firestore에서 현재 채팅방의 unreadCount 값 읽기
2. 시스템 메시지 전송 ("{userName}님이 나갔습니다.")
3. Firestore에서 채널 메타데이터에 deletedAt 설정
4. 채널 참여자 목록에서 사용자 제거
5. 서버 API 호출하여 현재 사용자의 unreadCount에서 해당 값만큼 차감

## 주요 함수 및 파일

### API 함수

**파일:** `src/features/chat/api/use-update-user-unread-count.ts`

```typescript
/**
 * 안읽은 메시지 수 업데이트
 * @param userId - 업데이트할 사용자 ID
 * @param unreadCount - 변경될 값 (음수는 차감, 양수는 합)
 */
export const updateChattingUnreadCount = async (
  userId: number,
  unreadCount: number,
): Promise<{ data: UpdateChattingUnreadCountResponse }>
```

**사용 예시:**
```typescript
import { updateChattingUnreadCount } from '@/features/chat/api/use-update-user-unread-count';

// unreadCount 증가
await updateChattingUnreadCount(12345, 1);

// unreadCount 감소
await updateChattingUnreadCount(12345, -5);
```

### React Hook

```typescript
export default function useUpdateChattingUnreadCount()
```

**반환값:**
- `mutate`: mutation 실행 함수
- `mutateAsync`: async mutation 실행 함수
- `isPending`: 로딩 상태
- `error`: 에러 객체
- `isSuccess`: 성공 여부

## 동작 흐름 다이어그램

### 메시지 전송 시
```
사용자 A가 사용자 B에게 메시지 전송
  ↓
Firestore: B의 unreadCount +1
  ↓
서버 API: B의 unreadCount +1
```

### 채팅방 입장 시
```
사용자가 채팅방 입장
  ↓
Firestore에서 현재 unreadCount 읽기 (예: 5)
  ↓
Firestore: unreadCount = 0으로 초기화
  ↓
서버 API: 사용자의 unreadCount -5
```

### 채팅방 나갈 때
```
사용자가 채팅방 나가기
  ↓
Firestore에서 현재 unreadCount 읽기 (예: 3)
  ↓
Firestore: 채널 deletedAt 설정
  ↓
서버 API: 사용자의 unreadCount -3
```

## 주의사항

### 1. 에러 처리
- 서버 동기화 실패 시에도 Firestore 업데이트는 성공 처리됩니다
- 에러는 콘솔에만 기록되며, 사용자에게는 표시되지 않습니다
- 이는 서버 동기화가 실패해도 채팅 기능이 정상 동작하도록 하기 위함입니다

### 2. 중복 호출 방지
- `resetUnreadCount`는 채팅방 입장 시와 cleanup 시 모두 호출될 수 있으나, Firestore의 unreadCount가 0이면 서버 API를 호출하지 않습니다

### 3. 타입 변환
- `receiverId`와 `userId`는 문자열로 전달되지만, API 호출 시 `Number()`로 변환하여 숫자로 전달합니다

### 4. 음수 처리
- `unreadCount`가 음수로 전달되면 서버에서 차감 처리됩니다
- 예: `updateChattingUnreadCount(12345, -5)` → 사용자 12345의 unreadCount를 5 감소

## 관련 파일

- `src/features/chat/api/use-update-user-unread-count.ts` - API 함수 및 Hook
- `src/features/chat/hook/use-send-message.ts` - 메시지 전송 Hook
- `src/features/chat/store/hair-consultation-chat-channel-store.ts` - 채널 Store (resetUnreadCount, leaveChannel)
- `src/app/chat/hair-consultation/[id]/page.tsx` - 채팅방 상세 페이지
- `src/features/chat/ui/message-section.tsx` - 메시지 섹션 컴포넌트

## 테스트 시나리오

### 시나리오 1: 메시지 전송
1. 사용자 A가 사용자 B에게 메시지 전송
2. Firestore에서 B의 unreadCount 확인 (1 증가)
3. 서버에서 B의 totalUnreadCount 확인 (1 증가)

### 시나리오 2: 채팅방 입장
1. 사용자 B의 채팅방에 unreadCount가 5인 채팅방 존재
2. 사용자 B가 해당 채팅방 입장
3. Firestore에서 해당 채팅방의 unreadCount 확인 (0으로 초기화)
4. 서버에서 B의 totalUnreadCount 확인 (5 감소)

### 시나리오 3: 채팅방 나가기
1. 사용자 B의 채팅방에 unreadCount가 3인 채팅방 존재
2. 사용자 B가 해당 채팅방 나가기
3. Firestore에서 해당 채널의 deletedAt 확인 (설정됨)
4. 서버에서 B의 totalUnreadCount 확인 (3 감소)

## 추가 개발 시 참고사항

1. **새로운 동기화 지점 추가 시**
   - Firestore 업데이트 후 서버 API 호출
   - 에러 처리는 기존 패턴과 동일하게 구현

2. **서버 API 변경 시**
   - `src/features/chat/api/use-update-user-unread-count.ts` 파일만 수정
   - 다른 파일은 수정 불필요

3. **디버깅**
   - 서버 동기화 실패 시 콘솔 로그 확인
   - Firestore와 서버의 unreadCount 값 비교

