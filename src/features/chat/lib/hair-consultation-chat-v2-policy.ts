import type { UserHairConsultationChatChannelType } from '../type/user-hair-consultation-chat-channel-type';

type ChatMetadata = Record<string, unknown> | undefined;

type ChatChannelUnavailabilityMetadata =
  | Partial<Pick<UserHairConsultationChatChannelType, 'deletedAt' | 'otherUserLeft'>>
  | undefined;

type HairConsultationReplyRefundMetadata =
  | Partial<
      Pick<
        UserHairConsultationChatChannelType,
        'billingCreateType' | 'isOpenUsingMong' | 'openMethod'
      >
    >
  | undefined;

const CHAT_V2_SCHEMA_VERSION = 2;
const HAIR_CONSULTATION_CHANNEL_TYPE = 'hairConsultation';
const HAIR_CONSULTATION_POST_TYPE = 'HAIR_CONSULTATION';
const RECEIVED_CHAT_REFUND_CREATE_TYPES = new Set([
  'OPEN_RECEIVED_CHAT_DESIGNER',
  'OPEN_RECEIVED_THUNDER_ANNOUNCEMENTS_CHAT_DESIGNER',
]);

export const HAIR_CONSULTATION_CHAT_MESSAGE_SEND_UNAVAILABLE_ERROR =
  'hair_consultation_v2_channel_unavailable';
export const CHAT_V2_USER_DELETED_REASON = 'USER_DELETED';

function nonEmptyString(value: unknown): string | null {
  if (typeof value !== 'string') return null;
  const normalized = value.trim();
  return normalized.length > 0 ? normalized : null;
}

function normalizedParticipantId(value: unknown): string | null {
  const normalized = nonEmptyString(value);
  if (normalized === null) return null;

  const parsed = Number(normalized);
  if (!Number.isSafeInteger(parsed) || parsed <= 0 || parsed.toString() !== normalized) {
    return null;
  }
  return normalized;
}

export function isHairConsultationChatMessageSendUnavailable(
  senderMetadata: ChatChannelUnavailabilityMetadata,
  receiverMetadata: ChatChannelUnavailabilityMetadata,
): boolean {
  return [senderMetadata, receiverMetadata].some(isChatChannelUnavailable);
}

function isChatChannelUnavailable(metadata: ChatChannelUnavailabilityMetadata): boolean {
  return metadata?.deletedAt != null || metadata?.otherUserLeft === true;
}

// 삭제·상대 이탈·전송 중 종료 감지는 모두 기존 메시지 열람만 허용하고 신규 전송은
// 막는 동일 상태이므로, 상세 화면의 읽기 전용 정책과 안내 문구를 하나로 유지한다.
export function isHairConsultationChatDetailReadOnly(
  currentUserMetadata: ChatChannelUnavailabilityMetadata,
  sendUnavailableAfterFailure: boolean,
): boolean {
  return sendUnavailableAfterFailure || isChatChannelUnavailable(currentUserMetadata);
}

export function canStartHairConsultationReplyRefundWait(
  metadata: HairConsultationReplyRefundMetadata,
): boolean {
  const billingCreateType = nonEmptyString(metadata?.billingCreateType);
  const openedWithMong = metadata?.isOpenUsingMong === true || metadata?.openMethod === 'MONG';

  return (
    openedWithMong &&
    billingCreateType !== null &&
    RECEIVED_CHAT_REFUND_CREATE_TYPES.has(billingCreateType)
  );
}

export function buildHairConsultationLeaveMessage(userName: string): string {
  return `${userName}님이\n채팅방을 나갔어요`;
}

export function resolveHairConsultationChatV2StartPointerId(
  channelData: ChatMetadata,
): string | null {
  if (
    channelData?.schemaVersion !== CHAT_V2_SCHEMA_VERSION ||
    channelData.channelType !== HAIR_CONSULTATION_CHANNEL_TYPE ||
    channelData.postType !== HAIR_CONSULTATION_POST_TYPE
  ) {
    return null;
  }

  const answerId = nonEmptyString(channelData.answerId);
  const rawParticipantIds = channelData.participantIds;
  if (answerId === null || !Array.isArray(rawParticipantIds) || rawParticipantIds.length !== 2) {
    return null;
  }

  const participantIds = rawParticipantIds.map(normalizedParticipantId);
  if (participantIds.some((id) => id === null)) return null;
  const sortedParticipantIds = (participantIds as string[]).sort(
    (left, right) => Number(left) - Number(right),
  );
  if (sortedParticipantIds[0] === sortedParticipantIds[1]) return null;

  return `${HAIR_CONSULTATION_CHANNEL_TYPE}_${HAIR_CONSULTATION_POST_TYPE}_${answerId}_${sortedParticipantIds[0]}_${sortedParticipantIds[1]}`;
}
