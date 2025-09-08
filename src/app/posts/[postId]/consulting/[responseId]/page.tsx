'use client';

import { useParams } from 'next/navigation';

import useGetConsultingResponse from '@/features/posts/api/use-get-consulting-response';
import ConsultingResponseHeader from '@/features/posts/ui/consulting-response/consulting-response-header';
import { SiteHeader } from '@/widgets/header';
import ConsultingResponseContainer from '@/widgets/post/ui/consulting-response/consulting-response-container';

export default function ConsultingResponsePage() {
  const { postId, responseId } = useParams();

  const { data: response } = useGetConsultingResponse(
    postId?.toString() ?? '',
    responseId?.toString() ?? '',
  );
  const consultingResponse = response?.data;

  if (!consultingResponse || !postId || !responseId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader title="컨설팅 답변" showBackButton />
      <div className="overflow-y-auto scrollbar-hide">
        <ConsultingResponseHeader
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
