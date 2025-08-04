'use client';

import ConsultingResponseHeader from '@/features/posts/ui/consulting-response/consulting-response-header';
import { SiteHeader } from '@/widgets/header';
import ConsultingResponseContainer from '@/widgets/post/ui/consulting-response-container';
import { useParams } from 'next/navigation';

export default function ConsultingResponsePage() {
  const { id } = useParams();

  if (!id) return null;

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader title="컨설팅 답변" showBackButton />
      <div className="overflow-y-auto scrollbar-hide">
        <ConsultingResponseHeader postId={id.toString()} />
        <ConsultingResponseContainer />
      </div>
    </div>
  );
}
