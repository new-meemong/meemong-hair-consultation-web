'use client';

import { doc, runTransaction } from 'firebase/firestore';

import { ChatChannelTypeEnum } from '@/features/chat/constants/chat-channel-type';
import type { UserDetail } from '@/entities/user/model/user-detail';
import { db } from '@/shared/lib/firebase';
import { getUser } from '@/features/auth/api/use-get-user';
import { openChatChannelInApp } from '@/shared/lib/app-bridge';
import { useCallback } from 'react';
import useIsFromApp from '@/features/chat/hook/use-is-from-app';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';

type ChatEntrySource = 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';

type UseStartModelMatchingChatParams = {
  receiverId: number | string;
  entrySource?: ChatEntrySource;
};

type PreparedModelMatchingChat = {
  channelId: string;
  entrySource?: ChatEntrySource;
};

const getUserModelMatchingPath = (userId: string) =>
  `users/${userId}/userModelMatchingChatChannels`;

const mapOtherUser = (user: UserDetail) => ({
  DisplayName: user.displayName,
  Email: user.email,
  FcmToken: user.fcmToken,
  ProfilePictureURL: user.profilePictureURL,
  Role: user.role ?? user.Role,
  Sex: user.sex,
  UserID: String(user.id),
  id: user.id,
  profileUrl: user.profileUrl ?? user.profilePictureURL,
  hairLength: user.modelInfo?.hairLength ?? user.hairLength ?? null,
  address: (user as UserDetail & { address?: string | null }).address ?? null,
  distance: null,
});

async function findOrCreateModelMatchingChannel({
  senderId,
  receiverId,
  entrySource,
}: {
  senderId: string;
  receiverId: string;
  entrySource?: ChatEntrySource;
}) {
  const [senderResponse, receiverResponse] = await Promise.all([
    getUser(senderId),
    getUser(receiverId),
  ]);
  const senderUser = senderResponse.data;
  const receiverUser = receiverResponse.data;
  const participantIds = [senderId, receiverId].sort();
  const channelKey = `${ChatChannelTypeEnum.MODEL_MATCHING_CHAT_CHANNELS}_${participantIds.join('_')}`;
  const channelRef = doc(db, ChatChannelTypeEnum.MODEL_MATCHING_CHAT_CHANNELS, channelKey);
  const now = new Date();

  const result = await runTransaction(db, async (transaction) => {
    const channelSnapshot = await transaction.get(channelRef);

    const buildUserMeta = (userId: string, entrySource?: ChatEntrySource) => {
      const otherUserId = participantIds.find((id) => id !== userId) ?? receiverId;
      const otherUser = userId === senderId ? receiverUser : senderUser;

      return {
        channelId: channelKey,
        otherUserId,
        userId,
        otherUser: mapOtherUser(otherUser),
        unreadCount: 0,
        isBlockChannel: false,
        lastMessage: {},
        isPinned: false,
        pinnedAt: null,
        lastReadAt: null,
        createdAt: now,
        updatedAt: now,
        deletedAt: null,
        otherUserLeft: false,
        hasReceivedFirst: userId === senderId ? false : true,
        hasFirstReply: false,
        isOpenUsingMong: false,
        awaitingReply: false,
        awaitingReplyStartedAt: null,
        isRefunded: false,
        refundedAt: null,
        ...(entrySource ? { entrySource } : {}),
      };
    };

    if (!channelSnapshot.exists()) {
      transaction.set(channelRef, {
        channelKey,
        participantsIds: participantIds,
        channelOpenUserId: senderId,
        createdAt: now,
        updatedAt: now,
        ...(entrySource ? { entrySource } : {}),
      });

      participantIds.forEach((userId) => {
        const userMetaRef = doc(db, getUserModelMatchingPath(userId), channelKey);
        transaction.set(userMetaRef, buildUserMeta(userId, entrySource));
      });

      return { channelId: channelKey, isCreated: true };
    }

    const participantRefs = participantIds.map((userId) =>
      doc(db, getUserModelMatchingPath(userId), channelKey),
    );
    const participantSnapshots = await Promise.all(
      participantRefs.map((participantRef) => transaction.get(participantRef)),
    );
    const hasDeletedChannel = participantSnapshots.some(
      (snapshot) => snapshot.exists() && snapshot.data()?.deletedAt != null,
    );

    transaction.update(channelRef, {
      participantsIds: participantIds,
      channelOpenUserId: senderId,
      updatedAt: now,
      ...(hasDeletedChannel ? { hasFirstReply: false } : {}),
      ...(entrySource ? { entrySource } : {}),
    });

    participantIds.forEach((userId, index) => {
      const participantSnapshot = participantSnapshots[index];
      const participantRef = participantRefs[index];

      if (!participantSnapshot.exists()) {
        transaction.set(participantRef, buildUserMeta(userId, entrySource));
        return;
      }

      if (hasDeletedChannel || entrySource) {
        transaction.update(participantRef, {
          updatedAt: now,
          ...(hasDeletedChannel
            ? {
                deletedAt: null,
                otherUserLeft: false,
                hasReceivedFirst: userId === senderId ? false : true,
                hasFirstReply: false,
                isOpenUsingMong: false,
                awaitingReply: false,
                awaitingReplyStartedAt: null,
                isRefunded: false,
                refundedAt: null,
              }
            : {}),
          ...(entrySource ? { entrySource } : {}),
        });
      }
    });

    return { channelId: channelKey, isCreated: false };
  });

  return result;
}

export default function useStartModelMatchingChat() {
  const auth = useOptionalAuthContext();
  const user = auth?.user ?? null;
  const isFromApp = useIsFromApp();

  const prepareModelMatchingChat = useCallback(
    async ({
      receiverId,
      entrySource,
    }: UseStartModelMatchingChatParams): Promise<PreparedModelMatchingChat | null> => {
      if (!user?.id) {
        console.error('사용자 정보가 없습니다.');
        return null;
      }

      try {
        const result = await findOrCreateModelMatchingChannel({
          senderId: user.id.toString(),
          receiverId: receiverId.toString(),
          entrySource,
        });

        if (!result.channelId) {
          return null;
        }

        return {
          channelId: result.channelId,
          entrySource,
        };
      } catch (error) {
        console.error('모델매칭 채팅 준비 중 오류 발생:', error);
        return null;
      }
    },
    [user?.id],
  );

  const openPreparedModelMatchingChat = useCallback(
    async ({ channelId, entrySource }: PreparedModelMatchingChat) => {
      if (!user?.id || !isFromApp) {
        return false;
      }

      return openChatChannelInApp({
        userId: user.id.toString(),
        chatChannelId: channelId,
        entrySource,
      });
    },
    [isFromApp, user?.id],
  );

  const startModelMatchingChat = useCallback(
    async ({ receiverId, entrySource }: UseStartModelMatchingChatParams) => {
      const preparedChat = await prepareModelMatchingChat({
        receiverId,
        entrySource,
      });

      if (!preparedChat) {
        return false;
      }

      return openPreparedModelMatchingChat(preparedChat);
    },
    [openPreparedModelMatchingChat, prepareModelMatchingChat],
  );

  return { startModelMatchingChat, prepareModelMatchingChat, openPreparedModelMatchingChat };
}
