'use client';

import { useParams } from 'next/navigation';

import useGetConsultingResponse from '@/features/posts/api/use-get-consulting-response';
import ConsultingResponseHeader from '@/features/posts/ui/consulting-response/consulting-response-header';
import { SiteHeader } from '@/widgets/header';
import ConsultingResponseContainer from '@/widgets/post/ui/consulting-response/consulting-response-container';

export default function ConsultingResponsePage() {
  const { id: postId } = useParams();

  const { data } = useGetConsultingResponse(postId?.toString() ?? '');
  const consultingResponse = data?.data.answer;

  if (!consultingResponse || !postId) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader title="컨설팅 답변" showBackButton />
      <div className="overflow-y-auto scrollbar-hide">
        <ConsultingResponseHeader postId={postId.toString()} />
        <ConsultingResponseContainer consultingResponse={consultingResponse} />
      </div>
    </div>
  );
}
