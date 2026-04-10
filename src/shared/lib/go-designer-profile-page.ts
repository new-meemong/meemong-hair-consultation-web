import type { ChatEntrySource } from '@/features/chat/type/chat-entry-source';
import { openInAppWebView } from './app-bridge';

export function goDesignerProfilePage(
  designerId: string,
  options?: {
    postId?: string;
    answerId?: string;
    entrySource?: ChatEntrySource;
    isTopAdvisorDesigner?: boolean;
    isMyHairConsultationPost?: boolean;
    isConsultingAnswerComment?: boolean;
    isConsultingDetailEntry?: boolean;
  },
) {
  const params = new URLSearchParams();
  params.set('from', 'hairConsultation');
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
