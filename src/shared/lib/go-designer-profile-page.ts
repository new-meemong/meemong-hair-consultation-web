import { consultationEntry } from './consultation-entry';
import type { ChatEntrySource } from '@/features/chat/type/chat-entry-source';
import type { ChatOriginEntrySource } from '@/shared/lib/chat-start-request';
import { openInAppWebView } from './app-bridge';

export function goDesignerProfilePage(
  designerId: string,
  options?: {
    postId?: string;
    answerId?: string;
    entrySource?: ChatEntrySource;
    originEntrySource?: ChatOriginEntrySource;
    isTopAdvisorDesigner?: boolean;
    isMyHairConsultationPost?: boolean;
    isConsultingAnswerComment?: boolean;
    isConsultingDetailEntry?: boolean;
  },
) {
  const params = new URLSearchParams();
  params.set('from', 'hairConsultation');
  params.set('chatJourney', JSON.stringify({
    version: 1, entry: consultationEntry(), section: options?.isTopAdvisorDesigner ? 'top_advisor' : options?.entrySource ?? 'unknown',
    steps: [options?.isTopAdvisorDesigner ? 'direct' : options?.entrySource === 'CONSULTING_RESPONSE' ? 'response_detail' : options?.entrySource === 'POST_COMMENT' ? 'post_comment' : 'unknown', 'designer_profile'],
    filters: { ...(options?.postId ? { postId: options.postId } : {}), ...(options?.answerId ? { answerId: options.answerId } : {}),
      ...(options?.isMyHairConsultationPost != null ? { isMyHairConsultationPost: options.isMyHairConsultationPost } : {}) },
    targetId: designerId,
  }));
  // null이 아닌 경우에만 파라미터 추가 (null은 명시적으로 전달하지 않음)
  if (options?.postId !== undefined && options.postId !== null) {
    params.set('postId', options.postId);
  }
  if (options?.answerId !== undefined && options.answerId !== null) {
    params.set('answerId', options.answerId);
  }
  if (options?.entrySource) {
    params.set('entrySource', options.entrySource);
  }
  if (options?.originEntrySource) {
    params.set('originEntrySource', options.originEntrySource);
  }
  if (options?.isTopAdvisorDesigner) {
    params.set('isTopAdvisorDesigner', 'true');
  }
  if (options?.isMyHairConsultationPost != null) {
    params.set('isMyHairConsultationPost', options.isMyHairConsultationPost ? 'true' : 'false');
  }
  if (options?.isConsultingAnswerComment != null) {
    params.set('isConsultingAnswerComment', options.isConsultingAnswerComment ? 'true' : 'false');
  }
  if (options?.isConsultingDetailEntry != null) {
    params.set('isConsultingDetailEntry', options.isConsultingDetailEntry ? 'true' : 'false');
  }

  openInAppWebView(`/designer/profile/${designerId}?${params.toString()}`, {
    reloadOnReturn: false,
  });
}
