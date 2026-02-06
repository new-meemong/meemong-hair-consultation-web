import type { ApiListResponse } from '@/shared/api/client';
import type { CommentWithReplyStatus } from '../model/comment';
import type { HairConsultationCommentWithReplies } from '../model/hair-consultation-comment';
import type { InfiniteData } from '@tanstack/react-query';
import convertToCommentWithReplyStatusCore from './convertToCommentWithReplyStatusCore';

export default function convertToCommentWithReplyStatusFromHairConsultationComment(
  data: InfiniteData<ApiListResponse<HairConsultationCommentWithReplies>> | undefined,
): CommentWithReplyStatus[] {
  return convertToCommentWithReplyStatusCore(data, (comment, isReply) => ({
    id: comment.id,
    content: comment.content,
    isVisibleToModel: false,
    createdAt: comment.createdAt,
    updatedAt: comment.updatedAt,
    user: {
      userId: comment.user.id,
      displayName: comment.user.displayName,
      profilePictureURL: comment.user.profilePictureURL,
      address: comment.user.address ?? undefined,
      companyName: comment.user.companyName ?? null,
      role: comment.user.role,
    },
    isReply,
    isAnonymous: false,
    isConsultingAnswer: false,
    hasAnswerImages: false,
  }));
}
