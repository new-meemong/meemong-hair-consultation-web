export function goDesignerProfilePage(
  designerId: string,
  options?: {
    postId?: string;
    answerId?: string;
    entrySource?: 'PROFILE' | 'CONSULTING_RESPONSE' | 'POST_COMMENT' | 'TOP_ADVISOR';
  },
) {
  if (window.goAppRouter) {
    const params = new URLSearchParams();
    params.set('from', 'hairConsultation');
    if (options?.postId) {
      params.set('postId', options.postId);
    }
    if (options?.answerId) {
      params.set('answerId', options.answerId);
    }
    if (options?.entrySource) {
      params.set('entrySource', options.entrySource);
    }
    window.goAppRouter(`/designer/profile/${designerId}?${params.toString()}`);
  }
}
