import {
  collection,
  doc,
  increment,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { create } from 'zustand';

import { db } from '@/shared/lib/firebase';

import { ChatChannelTypeEnum } from '../constants/chat-channel-type';
import { getDbPath } from '../lib/get-db-path';
import type {
  HairConsultationChatMessageType,
  HairConsultationChatMessageTypeEnum,
  MetaPathType,
} from '../type/hair-consultation-chat-message-type';

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
  }) => Promise<{ success: boolean; channelId: string | null }>;

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

        const newMessage: Omit<HairConsultationChatMessageType, 'id'> = {
          message,
          messageType,
          metaPathList,
          senderId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        await setDoc(messageRef, newMessage);

        // 채널의 lastMessage 업데이트
        const channelRef = doc(db, ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS, channelId);
        await updateDoc(channelRef, {
          updatedAt: serverTimestamp(),
        });

        // 양쪽 사용자의 메타데이터에 lastMessage 업데이트
        const senderMetaRef = doc(db, getDbPath(senderId), channelId);
        const receiverMetaRef = doc(db, getDbPath(receiverId), channelId);

        const lastMessageData = {
          id: messageRef.id,
          ...newMessage,
        };

        // 사용자 메타데이터 업데이트
        const updateSenderMeta = updateDoc(senderMetaRef, {
          lastMessage: lastMessageData,
          updatedAt: serverTimestamp(),
        });

        const updateReceiverMeta = updateDoc(receiverMetaRef, {
          lastMessage: lastMessageData,
          updatedAt: serverTimestamp(),
          unreadCount: increment(1),
        });

        await Promise.all([updateSenderMeta, updateReceiverMeta]);

        // 서버 unreadCount 동기화는 서버에서 메시지 전송 시 자동으로 처리됨
        // 여기서는 Firestore 업데이트만 수행

        return { success: true, channelId };
      } catch (error) {
        console.error('Error sending message:', error);
        set({ error: '메시지 전송에 실패했습니다.' });
        return { success: false, channelId: null };
      }
    },

    clearMessages: () => {
      set({ messages: [] });
    },
  }),
);
