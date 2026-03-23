'use client';

import HairConsultationFormContainer from '@/widgets/post/ui/consulting-post/hair-consultation-form-container';

// 비브랜드 /posts/create와 동일한 구조: HairConsultationFormContainer 직접 렌더
export default function Page() {
  return (
    <div className="h-screen bg-white flex flex-col min-h-0">
      <HairConsultationFormContainer />
    </div>
  );
}
