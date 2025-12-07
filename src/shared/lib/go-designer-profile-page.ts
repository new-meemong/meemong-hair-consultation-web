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
    window.goAppRouter(`/designer/profile/${designerId}?${params.toString()}`);
  }
}
