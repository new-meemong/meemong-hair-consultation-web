import {
  Timestamp,
  collection,
  doc,
  getDoc,
  increment,
  onSnapshot,
  runTransaction,
  serverTimestamp,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { create } from 'zustand';

import { getUser } from '@/features/auth/api/use-get-user';
import { db } from '@/shared/lib/firebase';

import { ChatChannelTypeEnum } from '../constants/chat-channel-type';
import { getDbPath } from '../lib/get-db-path';
import type { HairConsultationChatChannelType } from '../type/hair-consultation-chat-channel-type';
import {
  HairConsultationChatMessageTypeEnum,
  type HairConsultationChatMessageType,
} from '../type/hair-consultation-chat-message-type';
import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';

// Firestore에 저장된 실제 데이터 구조에 맞는 타입
// interface FirestoreUser {
//   DisplayName?: string;
//   Email?: string;
//   FcmToken?: string;
//   Korean?: string;
//   Role?: number;
//   Sex?: string;
//   profileUrl?: string;
//   UserID?: string | null;
//   id?: number;
//   // 기존 User 타입의 필드들도 포함
//   displayName?: string;
//   profilePictureURL?: string;
// }

interface ChatChannelState {
  userHairConsultationChatChannels: UserHairConsultationChatChannelType[];
  otherUserHairConsultationChatChannels: UserHairConsultationChatChannelType | null;
  loading: boolean;
  error: string | null;

  // 채널 관련 액션
  findOrCreateChannel: (params: {
    senderId: string;
    receiverId: string;
    postId?: string;
    answerId?: string;
    entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';
  }) => Promise<{ channelId: string | null; isCreated: boolean }>;

  subscribeToChannels: (userId: number) => () => void;

  // 해당 채널의 유저 unreadCount 초기화
  resetUnreadCount: (channelId: string, userId: string) => Promise<void>;

  updateUserLastReadAt: (channelId: string, userId: string) => Promise<void>;

  pinChannel: (channelId: string, userId: string) => Promise<void>;
  unpinChannel: (channelId: string, userId: string) => Promise<void>;

  // 해당 채널 차단
  blockChannel: (channelId: string, userId: string) => Promise<void>;

  // 해당 채널 차단 해제
  unblockChannel: (channelId: string, userId: string) => Promise<void>;

  getChannel: (channelId: string) => Promise<HairConsultationChatChannelType | null>;

  subscribeToOtherUser: (channelId: string, otherUserId: string) => () => void;

  subscribeToMine: (channelId: string, userId: string) => () => void;

  updateChannelUserInfo: (channelId: string, userId: string) => Promise<void>;

  leaveChannel: (
    channelId: string,
    userId: string,
    userName: string,
  ) => Promise<{ success: boolean }>;
}

export const useHairConsultationChatChannelStore = create<ChatChannelState>((set) => ({
  userHairConsultationChatChannels: [],
  loading: false,
  error: null,
  otherUserHairConsultationChatChannels: null,

  findOrCreateChannel: async ({ senderId, receiverId, postId, answerId, entrySource }) => {
    try {
      // 참여자 ID 정렬 및 channelKey 생성
      const participantIds = [senderId, receiverId].sort();
      const channelKey = `${ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS}_${participantIds.join('_')}`;

      // 채널 레퍼런스 생성
      const channelRef = doc(db, ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS, channelKey);

      // 트랜잭션을 사용하여 채널 생성 및 중복 방지
      const result = await runTransaction(db, async (transaction) => {
        const channelSnapshot = await transaction.get(channelRef);

        if (channelSnapshot.exists()) {
          // 채널이 존재하는 경우
          const existingData = channelSnapshot.data();
          const participantRefs = participantIds.map((userId) =>
            doc(db, getDbPath(userId), channelRef.id),
          );

          const participantSnapshots = await Promise.all(
            participantRefs.map((ref) => transaction.get(ref)),
          );

          // 참여자 중 한명이라도 deletedAt이 있으면 채널 재활성화
          const hasDeletedChannel = participantSnapshots.some(
            (snap) => snap.exists() && snap.data().deletedAt,
          );

          if (hasDeletedChannel) {
            // 모든 참여자의 채널을 재활성화
            participantRefs.forEach((ref) => {
              transaction.update(ref, {
                deletedAt: null,
                updatedAt: serverTimestamp(),
              });
            });
            return { channelId: channelRef.id, isCreated: true };
          }

          // 새로운 게시물 정보가 있고, 기존 정보와 다르다면 업데이트
          if (postId && existingData.postId !== postId) {
            // 채널 정보 업데이트
            const updateData: {
              postId: string;
              answerId?: string;
              entrySource?: string;
              updatedAt: ReturnType<typeof serverTimestamp>;
            } = {
              postId,
              updatedAt: serverTimestamp(),
            };
            if (answerId) updateData.answerId = answerId;
            if (entrySource) updateData.entrySource = entrySource;

            transaction.update(channelRef, updateData);

            // 참여자들의 메타데이터도 업데이트
            participantRefs.forEach((ref) => {
              transaction.update(ref, updateData);
            });
          }

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
          ...(postId && { postId }),
          ...(answerId && { answerId }),
          ...(entrySource && { entrySource }),
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
        };

        transaction.set(channelRef, newChannel);

        // 참여자별 메타데이터 생성 (경로 변경)
        participantIds.forEach((userId) => {
          const userMetaRef = doc(db, getDbPath(userId), channelRef.id);
          const otherUserId = participantIds.filter((id) => id !== userId)[0];
          const otherUserData = userId === senderId ? receiverData.data : senderData.data;

          const useMeta: UserHairConsultationChatChannelType = {
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
            ...(postId && { postId }),
            ...(answerId && { answerId }),
            ...(entrySource && { entrySource }),
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
            deletedAt: null,
          };
          transaction.set(userMetaRef, useMeta);
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
    set({ loading: true, userHairConsultationChatChannels: [] });
    // 사용자별 채널 메타데이터 구독 (경로 변경)
    const ref = collection(db, getDbPath(userId.toString()));

    const unsubscribe = onSnapshot(
      ref,
      async (snapshot) => {
        try {
          const channels = snapshot.docs
            .filter((doc) => {
              const data = doc.data();
              return !data.deletedAt; // null이거나 undefined인 경우 true
            })
            .map((doc) => {
              const data = doc.data();
              return {
                channelId: doc.id,
                ...data,
              };
            }) as UserHairConsultationChatChannelType[];

          const sortedChannels = sortChannels(channels);

          set({
            userHairConsultationChatChannels: sortedChannels,
            loading: false,
          });
        } catch (error) {
          console.error('채널 메타데이터 및 사용자 정보 로딩 에러:', error);
          set({
            error: '채널 정보를 불러오는 중 오류가 발생했습니다.',
            loading: false,
            userHairConsultationChatChannels: [],
          });
        }
      },
      (error) => {
        console.error('채널 메타데이터 구독 에러:', error);
        set({
          error: '채널 메타데이터를 불러오는 중 오류가 발생했습니다.',
          loading: false,
          userHairConsultationChatChannels: [],
        });
      },
    );

    return unsubscribe;
  },

  resetUnreadCount: async (channelId: string, userId: string) => {
    try {
      const ref = doc(db, getDbPath(userId), channelId);

      await updateDoc(ref, {
        unreadCount: 0,
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('안 읽은 메시지 카운트 리셋 중 오류 발생:', error);
    }
  },

  updateUserLastReadAt: async (channelId: string, userId: string) => {
    try {
      const userMetaRef = doc(db, getDbPath(userId), channelId);

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
      const userMetaRef = doc(db, getDbPath(userId), channelId);

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
      const userMetaRef = doc(db, getDbPath(userId), channelId);

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
      const userMetaRef = doc(db, getDbPath(userId), channelId);

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
      const userMetaRef = doc(db, getDbPath(userId), channelId);

      await updateDoc(userMetaRef, {
        isPinned: false,
        pinnedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('채널 고정 해제 중 오류 발생:', error);
    }
  },

  addChannelUserMetaUnreadCount: async (channelId: string, receiverId: string) => {
    try {
      const ref = doc(db, getDbPath(receiverId), channelId);

      await updateDoc(ref, {
        unreadCount: increment(1),
        updatedAt: serverTimestamp(),
      });
    } catch (error) {
      console.error('안 읽은 메시지 카운트 업데이트 중 오류 발생:', error);
    }
  },

  getChannel: async (channelId: string) => {
    try {
      const channelRef = doc(db, ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS, channelId);
      const channelSnap = await getDoc(channelRef);

      if (channelSnap.exists()) {
        const channelData = channelSnap.data();

        return {
          id: channelSnap.id,
          ...channelData,
        } as HairConsultationChatChannelType;
      }
      return null;
    } catch (error) {
      console.error('채널 정보 조회 중 오류 발생:', error);
      throw new Error('채널 정보를 불러오는 중 오류가 발생했습니다.');
    }
  },

  subscribeToOtherUser: (channelId: string, otherUserId: string) => {
    set({ loading: true });
    const ref = doc(db, getDbPath(otherUserId), channelId);

    const unsubscribe = onSnapshot(
      ref,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();

          set({
            otherUserHairConsultationChatChannels: {
              channelId: snapshot.id,
              ...data,
            } as UserHairConsultationChatChannelType,
            loading: false,
          });
        } else {
          set({
            loading: false,
          });
        }
      },
      (error) => {
        console.error('상대방 메타데이터 구독 에러:', error);
        set({
          loading: false,
        });
      },
    );

    return unsubscribe;
  },

  subscribeToMine: (channelId: string, userId: string) => {
    const ref = doc(db, getDbPath(userId), channelId);

    const unsubscribe = onSnapshot(
      ref,
      async (snapshot) => {
        if (snapshot.exists()) {
          const data = snapshot.data();

          set((state) => ({
            userHairConsultationChatChannels: [
              {
                channelId: snapshot.id,
                ...data,
              } as UserHairConsultationChatChannelType,
              ...state.userHairConsultationChatChannels.filter(
                (channel) => channel.channelId !== channelId,
              ),
            ],
          }));
        }
      },
      (error) => {
        console.error('내 메타데이터 구독 에러:', error);
      },
    );

    return unsubscribe;
  },

  updateChannelUserInfo: async (channelId: string, userId: string) => {
    try {
      const ref = doc(db, getDbPath(userId), channelId);

      const snap = await getDoc(ref);
      if (!snap.exists()) {
        console.warn('채널 메타데이터가 존재하지 않습니다:', { channelId, userId });
        return;
      }

      const userHairConsultationChatChannel = snap.data();

      // channelType이 없는 경우 처리
      if (!userHairConsultationChatChannel.channelType) {
        const channelRef = doc(db, ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS, channelId);
        const channelSnap = await getDoc(channelRef);

        if (channelSnap.exists()) {
          await updateDoc(ref, {
            updatedAt: serverTimestamp(),
          });
        }
      }
      // 항상 서버에서 최신 유저 정보를 가져와서 업데이트
      const userData = await getUser(userHairConsultationChatChannel.otherUserId);

      if (userData.success) {
        await updateDoc(ref, {
          otherUser: userData.data,
          updatedAt: serverTimestamp(),
        });
      } else {
        console.error('사용자 정보 가져오기 실패:', {
          otherUserId: userHairConsultationChatChannel.otherUserId,
        });
      }
    } catch (error) {
      console.error('사용자 정보 업데이트 중 오류 발생:', error);
    }
  },

  leaveChannel: async (channelId: string, userId: string, userName: string) => {
    try {
      // 1. 시스템 메시지 전송
      const messageRef = doc(
        collection(
          db,
          `${ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS}/${channelId}/messages`,
        ),
      );

      await setDoc(messageRef, {
        id: messageRef.id,
        message: `${userName}님이 나갔습니다.`,
        messageType: HairConsultationChatMessageTypeEnum.SYSTEM,
        metaPathList: [],
        senderId: 'system',
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 2. 유저의 채널 메타데이터 업데이트
      const ref = doc(db, getDbPath(userId), channelId);
      await updateDoc(ref, {
        deletedAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      // 3. 채널의 참여자 목록에서 유저 제거
      const channelRef = doc(db, ChatChannelTypeEnum.HAIR_CONSULTATION_CHAT_CHANNELS, channelId);
      const channelSnap = await getDoc(channelRef);

      if (channelSnap.exists()) {
        const channelData = channelSnap.data();
        const updatedParticipants = channelData.participantsIds.filter(
          (id: string) => id !== userId,
        );

        await updateDoc(channelRef, {
          participantsIds: updatedParticipants,
          updatedAt: serverTimestamp(),
        });
      }

      return { success: true };
    } catch (error) {
      console.error('채널 나가기 중 오류 발생:', error);
      return { success: false };
    }
  },
}));

// 채널 데이터를 정렬하는 함수
const sortChannels = (channels: UserHairConsultationChatChannelType[]) => {
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
