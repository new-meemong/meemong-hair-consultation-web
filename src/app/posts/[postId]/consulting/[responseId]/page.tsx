'use client';

import { useParams } from 'next/navigation';

import { useAuthContext } from '@/features/auth/context/auth-context';
import useGetConsultingResponse from '@/features/posts/api/use-get-consulting-response';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import ConsultingResponseHeader from '@/features/posts/ui/consulting-response/consulting-response-header';
import { SiteHeader } from '@/widgets/header';
import ConsultingResponseContainer from '@/widgets/post/ui/consulting-response/consulting-response-container';

export default function ConsultingResponsePage() {
  const { user } = useAuthContext();
  const { postId, responseId } = useParams();

  const { data: response } = useGetConsultingResponse(
    postId?.toString() ?? '',
    responseId?.toString() ?? '',
  );
  const consultingResponse = response?.data;

  const { data: postDetailResponse } = useGetPostDetail(postId?.toString() ?? '');

  const postDetail = postDetailResponse?.data;

  const isPostWriter = postDetail?.hairConsultPostingCreateUserId === user.id;

  if (!consultingResponse || !postId || !responseId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader title="컨설팅 답변" showBackButton />
      <div className="overflow-y-auto scrollbar-hide">
        <ConsultingResponseHeader
          isPostWriter={isPostWriter}
          postId={postId.toString()}
          author={consultingResponse.designer}
          createdAt={consultingResponse.createdAt}
          responseId={responseId.toString()}
        />
        <ConsultingResponseContainer consultingResponse={consultingResponse} />
      </div>
    </div>
  );
}
