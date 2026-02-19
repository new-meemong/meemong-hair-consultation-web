import type { ApiListResponse } from '@/shared/api/client';
import type { CommentWithReplyStatus } from '@/entities/comment/model/comment';
import type { HairConsultationAnswer } from '@/entities/posts/model/hair-consultation-answer';
import type { InfiniteData } from '@tanstack/react-query';

export default function convertToCommentWithReplyStatusFromHairConsultationAnswer(
  data: InfiniteData<ApiListResponse<HairConsultationAnswer>> | undefined,
): CommentWithReplyStatus[] {
  if (!data) return [];

  const STORE_CONSULTING_TEXT = '매장상담이 필요합니다';
  const isStoreConsulting = (value: boolean | number | null | undefined) =>
    value === true || value === 1;
  const joinOrNull = (values: string[] | null | undefined) =>
    values && values.length > 0 ? values.join(', ') : null;

  const seenAnswerIds = new Set<number>();
  const results: CommentWithReplyStatus[] = [];

  data.pages.forEach((page) => {
    page.dataList.forEach((answer) => {
      if (seenAnswerIds.has(answer.id)) return;
      seenAnswerIds.add(answer.id);

      results.push({
        // Prevent id collisions with comment ids in a mixed list.
        id: -answer.id,
        content: answer.title,
        isVisibleToModel: false,
        createdAt: answer.createdAt,
        updatedAt: answer.updatedAt,
        user: {
          userId: answer.user.id,
          displayName: answer.user.displayName,
          profilePictureURL: answer.user.profilePictureURL,
          companyName: null,
          role: answer.user.role,
        },
        isReply: false,
        isAnonymous: false,
        answerId: answer.id,
        isConsultingAnswer: true,
        hasAnswerImages: (answer.styleImages?.length ?? 0) > 0,
        analysisFaceShape: isStoreConsulting(answer.isFaceShapeAdvice)
          ? STORE_CONSULTING_TEXT
          : (answer.faceShape ?? null),
        analysisBangs: isStoreConsulting(answer.isBangsTypeAdvice)
          ? STORE_CONSULTING_TEXT
          : joinOrNull(answer.bangsTypes),
        analysisHairLength: isStoreConsulting(answer.isHairLengthAdvice)
          ? STORE_CONSULTING_TEXT
          : joinOrNull(answer.hairLengths),
        analysisHairLayer: isStoreConsulting(answer.isHairLayerAdvice)
          ? STORE_CONSULTING_TEXT
          : joinOrNull(answer.hairLayers),
        analysisHairCurl: isStoreConsulting(answer.isHairCurlAdvice)
          ? STORE_CONSULTING_TEXT
          : joinOrNull(answer.hairCurls),
        recommendedTreatment: answer.title ?? null,
      });
    });
  });

  return results;
}
