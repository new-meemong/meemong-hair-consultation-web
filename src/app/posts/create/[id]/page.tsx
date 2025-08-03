'use client';

import ConsultingResponseForm from '@/features/posts/ui/consulting-response-form/consulting-response-form';
import { SiteHeader } from '@/widgets/header';
import { useParams } from 'next/navigation';

export default function CreateConsultingPostPage() {
  const { id: postId } = useParams();

  console.log('postId', postId);

  return (
    <div className="h-screen bg-white flex flex-col min-h-0">
      <SiteHeader title="컨설팅 답변 작성" showBackButton />
      <ConsultingResponseForm />
    </div>
  );
}
