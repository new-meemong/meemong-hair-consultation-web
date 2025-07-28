import {
  Timestamp,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  updateDoc,
} from 'firebase/firestore';

import { ChatChannelTypeEnum } from '../constants/chat-channel-type';
import type { HairConsultationChatChannelUserMetaType } from '../type/hair-consultation-chat-channel-user-meta-type';
import { create } from 'zustand';
import { db } from '@/shared/lib/firebase';
import { getUser } from '@/features/auth/api/use-webview-login';
import type { HairConsultationChatChannelType } from '../type/hair-consultation-chat-channel-type';
import type { HairConsultationChatMessageType } from '../type/hair-consultation-chat-message-type';
import { getCurrentUser } from '@/shared';

interface ChatChannelState {
  chatChannelUserMetas: HairConsultationChatChannelUserMetaType[];
  otherUserMeta: HairConsultationChatChannelUserMetaType | null;
  loading: boolean;
  error: string | null;

  // 채널 관련 액션
  findOrCreateChannel: (params: {
    senderId: string;
    receiverId: string;
    jobPostingId: string | null; // 선택적 매개변수 추가
    resumeId: string | null; // 선택적 매개변수 추가
  }) => Promise<{ channelId: string | null; isCreated: boolean }>;

  subscribeToChannels: (userId: number) => () => void;

  // 해당 채널의 유저 unreadCount + 1
  addChannelUserMetaUnreadCount: (channelId: string, receiverId: string) => Promise<void>;

  // 해당 채널의 유저 unreadCount 초기화
  resetChannelUserMetaUnreadCount: (channelId: string, userId: string) => Promise<void>;

  updateUserLastReadAt: (channelId: string, userId: string) => Promise<void>;

  pinChannel: (channelId: string, userId: string) => Promise<void>;
  unpinChannel: (channelId: string, userId: string) => Promise<void>;

  // 해당 채널 차단
  blockChannel: (channelId: string, userId: string) => Promise<void>;

  // 해당 채널 차단 해제
  unblockChannel: (channelId: string, userId: string) => Promise<void>;

  getChannel: (channelId: string) => Promise<HairConsultationChatChannelType | null>;

  subscribeToOtherUserMeta: (channelId: string, otherUserId: string) => () => void;

  updateChannelUserInfo: (channelId: string, userId: string) => Promise<void>;
}

export const useHairConsultationChatChannelStore = create<ChatChannelState>((set) => ({
  chatChannelUserMetas: [],
  loading: false,
  error: null,
  otherUserMeta: null,

  findOrCreateChannel: async ({ senderId, receiverId, jobPostingId, resumeId }) => {
    try {
      // 참여자 ID 정렬 및 channelKey 생성
      const participantIds = [senderId, receiverId].sort();
      const channelKey = `${
        ChatChannelTypeEnum.JOB_POSTING_CHAT_CHANNELS
      }_${participantIds.join('_')}_${jobPostingId}_${resumeId}`;

      // 채널 레퍼런스 생성
      const channelRef = doc(db, ChatChannelTypeEnum.JOB_POSTING_CHAT_CHANNELS, channelKey);

      // 트랜잭션을 사용하여 채널 생성 및 중복 방지
      const result = await runTransaction(db, async (transaction) => {
        const channelSnapshot = await transaction.get(channelRef);
        if (channelSnapshot.exists()) {
          // 채널이 이미 존재하면 반환
          return { channelId: channelRef.id, isCreated: false };
        }

        // 각 참여자의 사용자 정보를 미리 가져옴
        const [senderData, receiverData] = await Promise.all([
          getUser(senderId),
          getUser(receiverId),
        ]);

        // 채널 생성
        const newChannel: Omit<HairConsultationChatChannelType, 'id'> = {
          channelKey,
          participantsIds: participantIds,
          channelOpenUserId: senderId,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        transaction.set(channelRef, newChannel);

        // 참여자별 메타데이터 생성 (경로 변경)
        participantIds.forEach((userId) => {
          const userMetaRef = doc(db, `users/${userId}/chatChannelUserMetas`, channelRef.id);
          const otherUserId = participantIds.filter((id) => id !== userId)[0];
          const otherUserData = userId === senderId ? receiverData.data : senderData.data;

          const userMeta: HairConsultationChatChannelUserMetaType = {
            channelId: channelRef.id,
            otherUserId,
            userId,
            otherUser: otherUserData,
            unreadCount: 0,
            isBlockChannel: false,
            lastMessage: {} as HairConsultationChatMessageType,
            isPinned: false,
            pinnedAt: null,
            lastReadAt: null,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          };
          transaction.set(userMetaRef, userMeta);
        });

        return { channelId: channelRef.id, isCreated: true };
      });

      return result;
    } catch (error) {
      set({ error: '채널 생성 중 오류가 발생했습니다.' });
      console.error('Error creating channel:', error);
      return { channelId: null, isCreated: false };
    }
  },

  subscribeToChannels: (userId: number) => {
    set({ loading: true });

    // 사용자별 채널 메타데이터 구독 (경로 변경)
    const userMetaRef = collection(db, `users/${userId}/chatChannelUserMetas`);

    const unsubscribe = onSnapshot(
      userMetaRef,
      async (snapshot) => {
        try {
          const userMetas = snapshot.docs.map((doc) => ({
            channelId: doc.id,
            ...doc.data(),
          })) as HairConsultationChatChannelUserMetaType[];

          const sortedChannels = sortChannels(userMetas);

          set({
            chatChannelUserMetas: sortedChannels,
            loading: false,
          });
        } catch (error) {
          console.error('채널 메타데이터 및 사용자 정보 로딩 에러:', error);
          set({
            error: '채널 정보를 불러오는 중 오류가 발생했습니다.',
            loading: false,
          });
        }
      },
      (error) => {
        console.error('채널 메타데이터 구독 에러:', error);
        set({
          error: '채널 메타데이터를 불러오는 중 오류가 발생했습니다.',
          loading: false,
        });
      },
    );

    return unsubscribe;
  },

  addChannelUserMetaUnreadCount: async (channelId: string, receiverId: string) => {
    try {
      const userMetaRef = doc(db, `users/${receiverId}/chatChannelUserMetas`, channelId);

      await updateDoc(userMetaRef, {
        unreadCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('안 읽은 메시지 카운트 업데이트 중 오류 발생:', error);
    }
  },

  resetChannelUserMetaUnreadCount: async (channelId: string, userId: string) => {
    try {
      const userMetaRef = doc(db, `users/${userId}/chatChannelUserMetas`, channelId);

      await updateDoc(userMetaRef, {
        unreadCount: 0,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('안 읽은 메시지 카운트 리셋 중 오류 발생:', error);
    }
  },

  updateUserLastReadAt: async (channelId: string, userId: string) => {
    try {
      const userMetaRef = doc(db, `users/${userId}/chatChannelUserMetas`, channelId);

      await updateDoc(userMetaRef, {
        lastReadAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('사용자 lastReadAt 업데이트 중 오류 발생:', error);
    }
  },

  blockChannel: async (channelId: string, userId: string) => {
    try {
      const userMetaRef = doc(db, `users/${userId}/chatChannelUserMetas`, channelId);

      await updateDoc(userMetaRef, {
        isBlockChannel: true,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('채널 차단 중 오류 발생:', error);
    }
  },

  unblockChannel: async (channelId: string, userId: string) => {
    try {
      const userMetaRef = doc(db, `users/${userId}/chatChannelUserMetas`, channelId);

      await updateDoc(userMetaRef, {
        isBlockChannel: false,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('채널 차단 해제 중 오류 발생:', error);
    }
  },

  pinChannel: async (channelId: string, userId: string) => {
    try {
      const userMetaRef = doc(db, `users/${userId}/chatChannelUserMetas`, channelId);

      await updateDoc(userMetaRef, {
        isPinned: true,
        pinnedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('채널 고정 중 오류 발생:', error);
    }
  },

  unpinChannel: async (channelId: string, userId: string) => {
    try {
      const userMetaRef = doc(db, `users/${userId}/chatChannelUserMetas`, channelId);

      await updateDoc(userMetaRef, {
        isPinned: false,
        pinnedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('채널 고정 해제 중 오류 발생:', error);
    }
  },

  getChannel: async (channelId: string) => {
    try {
      const currentUserId = getCurrentUser()?.UserID;
      const channelRef = doc(db, ChatChannelTypeEnum.JOB_POSTING_CHAT_CHANNELS, channelId);
      const channelSnap = await getDoc(channelRef);

      if (channelSnap.exists()) {
        const channelData = channelSnap.data();
        // 현재 사용자가 아닌 다른 참여자의 ID를 찾습니다
        const otherUserId = channelData.participantsIds.find((id: string) => id !== currentUserId);

        // 다른 사용자의 정보를 가져옵니다
        const otherUserData = await getUser(otherUserId);

        return {
          id: channelSnap.id,
          ...channelData,
          otherUser: otherUserData.success ? otherUserData.data : null,
        } as HairConsultationChatChannelType;
      }
      return null;
    } catch (error) {
      console.error('채널 정보 조회 중 오류 발생:', error);
      throw new Error('채널 정보를 불러오는 중 오류가 발생했습니다.');
    }
  },

  subscribeToOtherUserMeta: (channelId: string, otherUserId: string) => {
    const otherUserMetaRef = doc(db, `users/${otherUserId}/chatChannelUserMetas`, channelId);

    const unsubscribe = onSnapshot(
      otherUserMetaRef,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();
          const res = await getUser(data.otherUserId);

          set({
            otherUserMeta: {
              channelId: snapshot.id,
              ...data,
              otherUser: res.success ? res.data : null,
            } as HairConsultationChatChannelUserMetaType,
          });
        }
      },
      (error) => {
        console.error('상대방 메타데이터 구독 에러:', error);
      },
    );

    return unsubscribe;
  },

  updateChannelUserInfo: async (channelId: string, userId: string) => {
    try {
      const userMetaRef = doc(db, `users/${userId}/chatChannelUserMetas`, channelId);

      const userMetaSnap = await getDoc(userMetaRef);
      if (!userMetaSnap.exists()) return;

      const userMeta = userMetaSnap.data();
      const userData = await getUser(userMeta.otherUserId);

      if (userData.success) {
        await updateDoc(userMetaRef, {
          otherUser: userData.data,
          updatedAt: serverTimestamp(),
        });
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류 발생:', error);
    }
  },
}));

// 채널 데이터를 정렬하는 함수
const sortChannels = (channels: HairConsultationChatChannelUserMetaType[]) => {
  return channels.sort((a, b) => {
    // 둘 다 고정된 경우 pinnedAt으로 비교
    if (a.isPinned && b.isPinned) {
      const aTime = a.pinnedAt instanceof Timestamp ? a.pinnedAt.toMillis() : 0;
      const bTime = b.pinnedAt instanceof Timestamp ? b.pinnedAt.toMillis() : 0;
      return bTime - aTime;
    }

    // 고정된 항목을 위로
    if (a.isPinned) return -1;
    if (b.isPinned) return 1;

    // 나머지는 lastMessage.updatedAt으로 정렬
    const aTime =
      a.lastMessage.updatedAt instanceof Timestamp ? a.lastMessage.updatedAt.toMillis() : 0;
    const bTime =
      b.lastMessage.updatedAt instanceof Timestamp ? b.lastMessage.updatedAt.toMillis() : 0;
    return bTime - aTime;
  });
};
