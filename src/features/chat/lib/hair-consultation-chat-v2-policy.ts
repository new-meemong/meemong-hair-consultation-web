type ChatMetadata = Record<string, unknown> | undefined;

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
  senderMetadata: ChatMetadata,
  receiverMetadata: ChatMetadata,
): boolean {
  return [senderMetadata, receiverMetadata].some(
    (metadata) => metadata?.deletedAt != null || metadata?.otherUserLeft === true,
  );
}

export function canStartHairConsultationReplyRefundWait(metadata: ChatMetadata): boolean {
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
