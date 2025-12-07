# Firestore 데이터베이스 구조

## 개요

이 프로젝트는 Firebase Firestore를 데이터베이스로 사용합니다. 데이터베이스 이름은 `meemong-chat`입니다.

## 주요 컬렉션

### 1. 헤어컨설팅 채팅 채널 (`hairConsultationChatChannels`)

채팅 채널의 기본 정보를 저장하는 컬렉션입니다.

#### 경로

```
hairConsultationChatChannels/{channelKey}
```

#### 문서 구조

```typescript
interface HairConsultationChatChannelType {
  id: string; // 채널 ID (channelKey와 동일)
  channelKey: string; // `${channelType}_${참여자ID들.정렬().join('_')}`
  participantsIds: string[]; // 참여자 ID 목록 (정렬됨)
  channelOpenUserId: string; // 채널을 연 사용자 ID

  // 게시물 관련 정보
  postId?: string | null; // 게시물 ID (null: 다른 사람 글에서 채팅 시작한 경우)
  answerId?: string | null; // 컨설팅 답변 ID (null: 답변이 없는 경우)
  entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR'; // 진입 경로 (통계용)

  createdAt: Timestamp | FieldValue; // 생성 시간
  updatedAt: Timestamp | FieldValue; // 마지막 업데이트 시간
}
```

#### 하위 컬렉션

##### 메시지 (`messages`)

```
hairConsultationChatChannels/{channelKey}/messages/{messageId}
```

```typescript
interface HairConsultationChatMessageType {
  id: string;
  message: string;
  messageType: 'TEXT' | 'IMAGE' | 'SYSTEM';
  metaPathList?: string[];
  senderId: string;
  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
}
```

### 2. 사용자별 채팅 채널 메타데이터 (`users/{userId}/userHairConsultationChatChannels`)

각 사용자별로 채팅 채널에 대한 메타데이터를 저장하는 컬렉션입니다.

#### 경로

```
users/{userId}/userHairConsultationChatChannels/{channelId}
```

#### 문서 구조

```typescript
interface UserHairConsultationChatChannelType {
  channelId: string;
  unreadCount: number | FieldValue;
  isBlockChannel: boolean;

  lastMessage: HairConsultationChatMessageType;

  isPinned: boolean;
  pinnedAt: Timestamp | FieldValue | null;

  otherUserId: string;
  userId: string;

  // 게시물 관련 정보 (채널과 동일하게 저장)
  postId?: string | null; // 게시물 ID (null: 다른 사람 글에서 채팅 시작한 경우)
  answerId?: string | null; // 컨설팅 답변 ID (null: 답변이 없는 경우)
  entrySource?: ChatEntrySource;

  lastReadAt: Timestamp | FieldValue | null;

  createdAt: Timestamp | FieldValue;
  updatedAt: Timestamp | FieldValue;
  deletedAt: Timestamp | FieldValue | null; // null이 아닌 경우 삭제된 채널

  otherUser: User; // 상대방 유저 정보
}
```

## 데이터 일관성

### 채널과 메타데이터 동기화

- 채널 정보(`hairConsultationChatChannels`)와 사용자 메타데이터(`users/{userId}/userHairConsultationChatChannels`)는 트랜잭션을 통해 동시에 업데이트됩니다.
- `postId`, `answerId`, `entrySource`는 채널과 모든 참여자의 메타데이터에 동일하게 저장됩니다.

### 채널 키 생성 규칙

```typescript
const participantIds = [senderId, receiverId].sort();
const channelKey = `hairConsultationChatChannels_${participantIds.join('_')}`;
```

- 참여자 ID를 정렬하여 동일한 사용자 조합에 대해 항상 같은 채널 키가 생성됩니다.
- 같은 사용자 조합의 채팅방은 하나만 유지됩니다.

## 업데이트 로직

### 채널 정보 업데이트 조건

채널 정보는 다음 조건에서 업데이트됩니다:

1. `postId`가 변경된 경우
2. `answerId`가 변경된 경우
3. `entrySource`가 변경된 경우

```typescript
const postIdChanged = existingPostId !== newPostId;
const answerIdChanged = existingAnswerId !== newAnswerId;
const entrySourceChanged = entrySource && existingData.entrySource !== entrySource;

if (postIdChanged || answerIdChanged || entrySourceChanged) {
  // 채널 및 메타데이터 업데이트
}
```

## 주요 함수

### `getDbPath(userId: string)`

사용자별 채팅 채널 메타데이터 경로를 반환합니다.

```typescript
export function getDbPath(userId: string) {
  return `users/${userId}/userHairConsultationChatChannels`;
}
```

사용 예시:

```typescript
const userMetaRef = doc(db, getDbPath(userId), channelId);
// 결과: users/{userId}/userHairConsultationChatChannels/{channelId}
```

## 인덱스

현재 명시적인 인덱스 설정은 없으며, Firestore의 기본 인덱스를 사용합니다.

## 보안 규칙

Firestore 보안 규칙은 별도로 관리되며, 이 문서에서는 데이터 구조만 다룹니다.
