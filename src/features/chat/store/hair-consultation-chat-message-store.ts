import type {
  HairConsultationChatMessageType,
  HairConsultationChatMessageTypeEnum,
  MetaPathType,
} from '../type/hair-consultation-chat-message-type';
import {
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  runTransaction,
  serverTimestamp,
} from 'firebase/firestore';

import { ChatChannelTypeEnum } from '../constants/chat-channel-type';
import { create } from 'zustand';
import { db } from '@/shared/lib/firebase';
import { getDbPath } from '../lib/get-db-path';
import { updateDesignerLastChatReceivedAtAfterSend } from '../api/update-designer-last-chat-received-at';
import { resolveChatV2MessageStateTransition } from '../lib/chat-v2-message-state-transition';
import {
  HAIR_CONSULTATION_CHAT_MESSAGE_SEND_UNAVAILABLE_ERROR,
  canStartHairConsultationReplyRefundWait,
  isHairConsultationChatMessageSendUnavailable,
} from '../lib/hair-consultation-chat-v2-policy';

interface HairConsultationChatMessageState {
  messages: HairConsultationChatMessageType[];
  loading: boolean;
  error: string | null;

  // 메시지 구독 관련 액션
  subscribeToMessages: (channelId: string) => () => void;

  // 메시지 전송 관련 액션
  sendMessage: (params: {
    channelId: string;
    senderId: string;
    receiverId: string;
    message: string;
    messageType: HairConsultationChatMessageTypeEnum;
    metaPathList?: MetaPathType[];
  }) => Promise<{ success: boolean; channelId: string | null; errorCode?: string }>;

  clearMessages: () => void;
}

export const useHairConsultationChatMessageStore = create<HairConsultationChatMessageState>(
  (set) => ({
    messages: [],
    loading: false,
    error: null,
    hasMore: true,
    lastMessage: null,

    subscribeToMessages: (channelId: string) => {
      set({ loading: true });

      const q = query(
        collection(
          db,
          `${ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS}/${channelId}/messages`,
        ),
        orderBy('createdAt', 'desc'),
      );

      const unsubscribe = onSnapshot(
        q,
        (snapshot) => {
          const messages = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as HairConsultationChatMessageType[];

          set({
            messages: messages.reverse(),
            loading: false,
          });
        },
        (error) => {
          set({
            error: '메시지를 불러오는 중 오류가 발생했습니다.',
            loading: false,
          });
          console.error('Error fetching messages:', error);
        },
      );

      return unsubscribe;
    },

    sendMessage: async ({
      channelId,
      senderId,
      receiverId,
      message,
      messageType,
      metaPathList = [],
    }) => {
      try {
        if (!channelId) {
          return { success: false, channelId: null };
        }

        // 메시지 생성
        const messageRef = doc(
          collection(
            db,
            `${ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS}/${channelId}/messages`,
          ),
        );

        const activityAt = serverTimestamp();
        const newMessage: Omit<HairConsultationChatMessageType, 'id'> = {
          message,
          messageType,
          metaPathList,
          senderId,
          createdAt: activityAt,
          updatedAt: activityAt,
        };

        const channelRef = doc(db, ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS, channelId);
        const senderMetaRef = doc(db, getDbPath(senderId), channelId);
        const receiverMetaRef = doc(db, getDbPath(receiverId), channelId);
        const lastMessageData = {
          id: messageRef.id,
          ...newMessage,
        };

        await runTransaction(db, async (transaction) => {
          const [channelSnapshot, senderMetaSnapshot, receiverMetaSnapshot] = await Promise.all([
            transaction.get(channelRef),
            transaction.get(senderMetaRef),
            transaction.get(receiverMetaRef),
          ]);
          if (
            !channelSnapshot.exists() ||
            !senderMetaSnapshot.exists() ||
            !receiverMetaSnapshot.exists()
          ) {
            throw new Error('hair_consultation_chat_channel_not_found');
          }

          const channelData = channelSnapshot.data();
          const senderMetadata = senderMetaSnapshot.data();
          const receiverMetadata = receiverMetaSnapshot.data();
          if (isHairConsultationChatMessageSendUnavailable(senderMetadata, receiverMetadata)) {
            throw new Error(HAIR_CONSULTATION_CHAT_MESSAGE_SEND_UNAVAILABLE_ERROR);
          }

          const isV2Channel = channelData.schemaVersion === 2;
          const channelOpenUserId = channelData.channelOpenUserId;
          if (
            isV2Channel &&
            (typeof channelOpenUserId !== 'string' || channelOpenUserId.trim().length === 0)
          ) {
            throw new Error('hair_consultation_v2_channel_invalid');
          }
          const transition = isV2Channel
            ? resolveChatV2MessageStateTransition({
                messageType,
                senderId,
                channelOpenUserId: channelOpenUserId.trim(),
                channelHasFirstReply: channelData.hasFirstReply === true,
                senderCanAwaitReplyRefund: canStartHairConsultationReplyRefundWait(senderMetadata),
                senderIsRefunded: senderMetadata.isRefunded === true,
                receiverAwaitingReply: receiverMetadata.awaitingReply === true,
              })
            : {
                marksFirstReply: false,
                startsSenderAwaitingReply: false,
                clearsReceiverAwaitingReply: false,
              };

          transaction.set(messageRef, newMessage);
          transaction.update(channelRef, {
            lastActivityAt: activityAt,
            updatedAt: activityAt,
            ...(transition.marksFirstReply ? { hasFirstReply: true } : {}),
          });
          transaction.update(senderMetaRef, {
            lastMessage: lastMessageData,
            lastActivityAt: activityAt,
            updatedAt: activityAt,
            ...(transition.startsSenderAwaitingReply
              ? {
                  awaitingReply: true,
                  awaitingReplyStartedAt: activityAt,
                }
              : {}),
          });
          transaction.update(receiverMetaRef, {
            lastMessage: lastMessageData,
            lastActivityAt: activityAt,
            updatedAt: activityAt,
            unreadCount: increment(1),
            ...(transition.marksFirstReply ? { hasFirstReply: true } : {}),
            ...(transition.clearsReceiverAwaitingReply
              ? {
                  awaitingReply: false,
                  awaitingReplyStartedAt: null,
                }
              : {}),
          });
        });

        void updateDesignerLastChatReceivedAtAfterSend(receiverId);

        // 서버 unreadCount 동기화는 서버에서 메시지 전송 시 자동으로 처리됨
        // 여기서는 Firestore 업데이트만 수행

        return { success: true, channelId };
      } catch (error) {
        console.error('Error sending message:', error);
        const errorCode =
          error instanceof Error &&
          error.message === HAIR_CONSULTATION_CHAT_MESSAGE_SEND_UNAVAILABLE_ERROR
            ? HAIR_CONSULTATION_CHAT_MESSAGE_SEND_UNAVAILABLE_ERROR
            : undefined;
        set({
          error:
            errorCode === HAIR_CONSULTATION_CHAT_MESSAGE_SEND_UNAVAILABLE_ERROR
              ? '상대방이 나간 채팅방입니다.'
              : '메시지 전송에 실패했습니다.',
        });
        return { success: false, channelId: null, ...(errorCode ? { errorCode } : {}) };
      }
    },

    clearMessages: () => {
      set({ messages: [] });
    },
  }),
);
