import { arrayRemove, deleteField } from 'firebase/firestore';
import type { DocumentReference, FieldValue, Transaction } from 'firebase/firestore';

import {
  CHAT_V2_USER_DELETED_REASON,
  buildHairConsultationLeaveMessage,
} from './hair-consultation-chat-v2-policy';

type ApplyHairConsultationLeaveWritesParams = {
  transaction: Pick<Transaction, 'set' | 'update'>;
  messageRef: DocumentReference;
  userMetaRef: DocumentReference;
  otherUserMetaRef: DocumentReference | null;
  channelRef: DocumentReference | null;
  startPointerRef: DocumentReference | null;
  userId: string;
  userName: string;
  systemMessageType: string;
  timestamp: FieldValue;
  fieldValueFactory?: LeaveFieldValueFactory;
};

type ResolveHairConsultationLeaveWriteTargetsParams = {
  otherUserMetaRef: DocumentReference | null;
  otherUserMetaExists: boolean;
  channelRef: DocumentReference;
  channelExists: boolean;
  startPointerRef: DocumentReference | null;
  startPointerExists: boolean;
  startPointerTargetChannelId: unknown;
  channelId: string;
};

type LeaveFieldValueFactory = {
  arrayRemove: (value: string) => FieldValue;
  deleteField: () => FieldValue;
};

const firebaseLeaveFieldValueFactory: LeaveFieldValueFactory = {
  arrayRemove,
  deleteField,
};

export function resolveHairConsultationLeaveWriteTargets({
  otherUserMetaRef,
  otherUserMetaExists,
  channelRef,
  channelExists,
  startPointerRef,
  startPointerExists,
  startPointerTargetChannelId,
  channelId,
}: ResolveHairConsultationLeaveWriteTargetsParams): Pick<
  ApplyHairConsultationLeaveWritesParams,
  'otherUserMetaRef' | 'channelRef' | 'startPointerRef'
> {
  return {
    otherUserMetaRef: otherUserMetaRef !== null && otherUserMetaExists ? otherUserMetaRef : null,
    channelRef: channelExists ? channelRef : null,
    startPointerRef:
      startPointerRef !== null && startPointerExists && startPointerTargetChannelId === channelId
        ? startPointerRef
        : null,
  };
}

/**
 * 헤어컨설팅 나가기의 모든 Firestore write를 동일 transaction에 적용한다.
 * 필드 계약 정본은 meemong-flutter-app의
 * lib/data/chat/chat_channel_participant_exit_lifecycle.dart이다.
 */
export function applyHairConsultationLeaveWrites({
  transaction,
  messageRef,
  userMetaRef,
  otherUserMetaRef,
  channelRef,
  startPointerRef,
  userId,
  userName,
  systemMessageType,
  timestamp,
  fieldValueFactory = firebaseLeaveFieldValueFactory,
}: ApplyHairConsultationLeaveWritesParams): void {
  transaction.set(messageRef, {
    id: messageRef.id,
    message: buildHairConsultationLeaveMessage(userName),
    messageType: systemMessageType,
    metaPathList: [],
    senderId: 'system',
    createdAt: timestamp,
    updatedAt: timestamp,
  });
  transaction.update(userMetaRef, {
    deletedAt: timestamp,
    deleteReason: CHAT_V2_USER_DELETED_REASON,
    unreadCount: 0,
    updatedAt: timestamp,
  });
  if (otherUserMetaRef !== null) {
    // 사용자 나가기는 계정 비활성화와 별개이므로 이전 비활성 표시를 남기지 않는다.
    transaction.update(otherUserMetaRef, {
      otherUserLeft: true,
      otherUserDeactivated: false,
      updatedAt: timestamp,
    });
  }
  if (channelRef !== null) {
    // participantIds는 불변 identity이고 participantsIds만 활성 참여자 mirror이다.
    transaction.update(channelRef, {
      participantsIds: fieldValueFactory.arrayRemove(userId),
      updatedAt: timestamp,
    });
  }
  if (startPointerRef !== null) {
    // room 순번은 보존해 다음 방 생성 시 기존 ID와 충돌하지 않게 한다.
    transaction.update(startPointerRef, {
      targetChannelId: fieldValueFactory.deleteField(),
      targetSourceCollection: fieldValueFactory.deleteField(),
      updatedAt: timestamp,
    });
  }
}
