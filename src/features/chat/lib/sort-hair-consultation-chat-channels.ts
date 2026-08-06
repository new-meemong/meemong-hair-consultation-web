interface FirestoreTimestampLike {
  toMillis: () => number;
}

interface HairConsultationChatChannelSortMetadata {
  isPinned?: boolean;
  pinnedAt?: unknown;
  lastActivityAt?: unknown;
  lastMessage?: {
    updatedAt?: unknown;
  } | null;
  createdAt?: unknown;
}

function timestampMillis(value: unknown): number | null {
  if (
    value === null ||
    typeof value !== 'object' ||
    !('toMillis' in value) ||
    typeof (value as FirestoreTimestampLike).toMillis !== 'function'
  ) {
    return null;
  }

  const millis = (value as FirestoreTimestampLike).toMillis();
  return Number.isFinite(millis) ? millis : null;
}

function activityMillis(channel: HairConsultationChatChannelSortMetadata): number {
  return Math.max(
    timestampMillis(channel.lastActivityAt) ?? 0,
    timestampMillis(channel.lastMessage?.updatedAt) ?? 0,
    timestampMillis(channel.createdAt) ?? 0,
  );
}

export function sortHairConsultationChatChannels<T extends HairConsultationChatChannelSortMetadata>(
  channels: readonly T[],
): T[] {
  return [...channels].sort((left, right) => {
    if (left.isPinned && right.isPinned) {
      const pinnedAtDifference =
        (timestampMillis(right.pinnedAt) ?? 0) - (timestampMillis(left.pinnedAt) ?? 0);
      if (pinnedAtDifference !== 0) return pinnedAtDifference;
      return activityMillis(right) - activityMillis(left);
    }

    if (left.isPinned) return -1;
    if (right.isPinned) return 1;

    return activityMillis(right) - activityMillis(left);
  });
}
