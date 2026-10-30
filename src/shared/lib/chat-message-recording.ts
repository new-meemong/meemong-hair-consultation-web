import { doc, getDocFromServer, Timestamp } from 'firebase/firestore';
import {
  createChatMessageRecordingQueue,
  type ChatMessageRecord,
} from './chat-message-recording-queue';
import { getCurrentUser } from './auth';
import { db } from './firebase';
import { apiClient } from '@/shared/api/client';

export const chatMessageRecording = createChatMessageRecordingQueue({
  storage: () => window.localStorage,
  session: () => {
    const user = getCurrentUser();
    return user?.token ? { id: String(user.id), token: user.token } : null;
  },
  read: async (record) => {
    const snapshot = await getDocFromServer(
      doc(db, record.sourceCollection, record.channelId, 'messages', record.messageId),
    );
    if (!snapshot.exists()) return 'rejected';
    const value = snapshot.data();
    if (
      String(value.senderId) !== record.senderId ||
      value.deletedAt ||
      value.analyticsKind === 'automatic' ||
      !['text', 'image', 'file'].includes(value.messageType)
    )
      return 'rejected';
    return !snapshot.metadata.hasPendingWrites && value.createdAt instanceof Timestamp
      ? 'ready'
      : 'pending';
  },
  post: async (body, owner) => {
    return apiClient.postChatMessageRecord(body, owner.token);
  },
});

export function recordAcceptedChatMessage(
  record: ChatMessageRecord,
  messageType: string,
  automatic = false,
) {
  if (!automatic && ['text', 'image', 'file'].includes(messageType))
    chatMessageRecording.enqueue(record);
}

if (typeof window !== 'undefined') {
  for (const event of ['online', 'focus', 'storage'])
    window.addEventListener(event, () => void chatMessageRecording.flush());
}
