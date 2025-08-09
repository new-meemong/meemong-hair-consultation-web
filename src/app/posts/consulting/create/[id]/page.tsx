'use client';

import { useState } from 'react';

import { useParams } from 'next/navigation';

import { PostDetailProvider } from '@/features/posts/context/post-detail-context';
import ConsultingResponseForm from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-form';
import ConsultingResponseSidebarButton from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-sidebar/consulting-response-sidebar-button';
import { SiteHeader } from '@/widgets/header';
import ConsultingResponseSidebar from '@/widgets/post/ui/consulting-response-sidebar/consulting-response-sidebar';

export default function CreateConsultingPostPage() {
  const { id: postId } = useParams();

  const [showedSidebar, setShowedSidebar] = useState(false);

  const handleSidebarButtonClick = () => {
    setShowedSidebar((prev) => !prev);
  };

  if (!postId) return null;

  return (
    <div className="h-screen bg-white flex flex-col min-h-0">
      <PostDetailProvider postId={postId.toString()}>
        <SiteHeader title="컨설팅 답변 작성" showBackButton />
        <ConsultingResponseForm />
        <ConsultingResponseSidebar isOpen={showedSidebar} onClose={handleSidebarButtonClick} />
        <div className="absolute bottom-25.5 right-5">
          <ConsultingResponseSidebarButton onClick={handleSidebarButtonClick} />
        </div>
      </PostDetailProvider>
    </div>
  );
}
