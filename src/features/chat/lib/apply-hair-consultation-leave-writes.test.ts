import { describe, expect, it } from 'vitest';

import {
  applyHairConsultationLeaveWrites,
  resolveHairConsultationLeaveWriteTargets,
} from './apply-hair-consultation-leave-writes';

type Write = readonly [operation: 'set' | 'update', path: string, data: unknown];

const reference = (path: string, id = path.split('/').at(-1)) => ({ path, id });

describe('applyHairConsultationLeaveWrites', () => {
  it('나가기 전이 5개와 FieldValue 의미를 같은 transaction writer에 기록한다', () => {
    const writes: Write[] = [];
    const transaction = {
      set: (ref: { path: string }, data: unknown) => writes.push(['set', ref.path, data]),
      update: (ref: { path: string }, data: unknown) => writes.push(['update', ref.path, data]),
    };
    const timestamp = { kind: 'serverTimestamp' };
    const removedParticipant = { kind: 'arrayRemove', value: '11' };
    const deletedPointerFields = [
      { kind: 'deleteField', index: 0 },
      { kind: 'deleteField', index: 1 },
    ];
    const fieldValueCalls: Array<readonly [operation: string, value?: string]> = [];
    let deleteFieldCallCount = 0;

    applyHairConsultationLeaveWrites({
      transaction: transaction as never,
      messageRef: reference(
        'hairConsultationChatChannels/channel/messages/message-1',
        'message-1',
      ) as never,
      userMetaRef: reference('users/11/userHairConsultationChatChannels/channel') as never,
      otherUserMetaRef: reference('users/22/userHairConsultationChatChannels/channel') as never,
      channelRef: reference('hairConsultationChatChannels/channel') as never,
      startPointerRef: reference('chatRoomStartPointers/start-pointer') as never,
      userId: '11',
      userName: '문새',
      systemMessageType: 'SYSTEM',
      timestamp: timestamp as never,
      fieldValueFactory: {
        arrayRemove: (value) => {
          fieldValueCalls.push(['arrayRemove', value]);
          return removedParticipant as never;
        },
        deleteField: () => {
          fieldValueCalls.push(['deleteField']);
          return deletedPointerFields[deleteFieldCallCount++] as never;
        },
      },
    });

    expect(fieldValueCalls).toEqual([['arrayRemove', '11'], ['deleteField'], ['deleteField']]);
    expect(writes).toEqual([
      [
        'set',
        'hairConsultationChatChannels/channel/messages/message-1',
        {
          id: 'message-1',
          message: '문새님이\n채팅방을 나갔어요',
          messageType: 'SYSTEM',
          metaPathList: [],
          senderId: 'system',
          createdAt: timestamp,
          updatedAt: timestamp,
        },
      ],
      [
        'update',
        'users/11/userHairConsultationChatChannels/channel',
        {
          deletedAt: timestamp,
          deleteReason: 'USER_DELETED',
          unreadCount: 0,
          updatedAt: timestamp,
        },
      ],
      [
        'update',
        'users/22/userHairConsultationChatChannels/channel',
        { otherUserLeft: true, otherUserDeactivated: false, updatedAt: timestamp },
      ],
      [
        'update',
        'hairConsultationChatChannels/channel',
        { participantsIds: removedParticipant, updatedAt: timestamp },
      ],
      [
        'update',
        'chatRoomStartPointers/start-pointer',
        {
          targetChannelId: deletedPointerFields[0],
          targetSourceCollection: deletedPointerFields[1],
          updatedAt: timestamp,
        },
      ],
    ]);
  });

  it('null로 선택된 문서에는 write와 FieldValue 생성을 하지 않는다', () => {
    const writes: Write[] = [];
    const transaction = {
      set: (ref: { path: string }, data: unknown) => writes.push(['set', ref.path, data]),
      update: (ref: { path: string }, data: unknown) => writes.push(['update', ref.path, data]),
    };

    applyHairConsultationLeaveWrites({
      transaction: transaction as never,
      messageRef: reference('messages/message-1', 'message-1') as never,
      userMetaRef: reference('users/11/channels/channel') as never,
      otherUserMetaRef: null,
      channelRef: null,
      startPointerRef: null,
      userId: '11',
      userName: '문새',
      systemMessageType: 'SYSTEM',
      timestamp: { kind: 'serverTimestamp' } as never,
      fieldValueFactory: {
        arrayRemove: () => {
          throw new Error('optional main channel write must be skipped');
        },
        deleteField: () => {
          throw new Error('optional pointer write must be skipped');
        },
      },
    });

    expect(writes.map((write) => write[1])).toEqual([
      'messages/message-1',
      'users/11/channels/channel',
    ]);
  });

  it('존재하는 문서와 현재 방을 가리키는 포인터만 선택한다', () => {
    const otherUserMetaRef = reference('users/22/channels/channel');
    const channelRef = reference('channels/channel');
    const startPointerRef = reference('chatRoomStartPointers/pointer');

    expect(
      resolveHairConsultationLeaveWriteTargets({
        otherUserMetaRef: otherUserMetaRef as never,
        otherUserMetaExists: true,
        channelRef: channelRef as never,
        channelExists: true,
        startPointerRef: startPointerRef as never,
        startPointerExists: true,
        startPointerTargetChannelId: 'channel',
        channelId: 'channel',
      }),
    ).toEqual({ otherUserMetaRef, channelRef, startPointerRef });
    expect(
      resolveHairConsultationLeaveWriteTargets({
        otherUserMetaRef: otherUserMetaRef as never,
        otherUserMetaExists: false,
        channelRef: channelRef as never,
        channelExists: false,
        startPointerRef: startPointerRef as never,
        startPointerExists: true,
        startPointerTargetChannelId: 'another-channel',
        channelId: 'channel',
      }),
    ).toEqual({
      otherUserMetaRef: null,
      channelRef: null,
      startPointerRef: null,
    });
  });
});
