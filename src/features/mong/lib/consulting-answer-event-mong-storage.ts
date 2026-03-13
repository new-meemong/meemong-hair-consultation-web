import type { CreateEventMongResponse } from '@/entities/mong/api/create-event-mong-response';

const CONSULTING_ANSWER_EVENT_MONG_STORAGE_KEY = 'consulting-answer-event-mong';
const CONSULTING_ANSWER_EVENT_MONG_TTL_MS = 10 * 60 * 1000;

type PendingConsultingAnswerEventMong = {
  postId: string;
  rewardedAt: number;
  rewardData: CreateEventMongResponse;
};

export const savePendingConsultingAnswerEventMong = ({
  postId,
  rewardData,
}: {
  postId: string;
  rewardData: CreateEventMongResponse;
}) => {
  if (typeof window === 'undefined' || rewardData === null) return;

  const payload: PendingConsultingAnswerEventMong = {
    postId,
    rewardedAt: Date.now(),
    rewardData,
  };

  try {
    sessionStorage.setItem(CONSULTING_ANSWER_EVENT_MONG_STORAGE_KEY, JSON.stringify(payload));
  } catch {
    // Ignore storage failures.
  }
};

export const consumePendingConsultingAnswerEventMong = ({
  postId,
}: {
  postId: string;
}): CreateEventMongResponse => {
  if (typeof window === 'undefined') return null;

  const clear = () => {
    try {
      sessionStorage.removeItem(CONSULTING_ANSWER_EVENT_MONG_STORAGE_KEY);
    } catch {
      // Ignore storage failures.
    }
  };

  try {
    const raw = sessionStorage.getItem(CONSULTING_ANSWER_EVENT_MONG_STORAGE_KEY);
    if (!raw) return null;

    const parsed = JSON.parse(raw) as Partial<PendingConsultingAnswerEventMong>;
    const parsedPostId = parsed.postId;
    const rewardedAt = parsed.rewardedAt;
    const rewardData = parsed.rewardData;

    if (
      typeof parsedPostId !== 'string' ||
      typeof rewardedAt !== 'number' ||
      rewardData === undefined
    ) {
      clear();
      return null;
    }

    if (parsedPostId !== postId) {
      return null;
    }

    if (Date.now() - rewardedAt > CONSULTING_ANSWER_EVENT_MONG_TTL_MS) {
      clear();
      return null;
    }

    clear();
    return rewardData;
  } catch {
    clear();
    return null;
  }
};
