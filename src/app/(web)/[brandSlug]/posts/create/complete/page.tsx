'use client';

import { useRouter } from 'next/navigation';

import { useBrand } from '@/shared/context/brand-context';
import { ROUTES } from '@/shared';
import { SiteHeader } from '@/widgets/header';
import HairConsultationFormContainer from '@/widgets/post/ui/consulting-post/hair-consultation-form-container';

// 5단계 step 입력 완료 후 도달하는 폼 제출 페이지
// HairConsultationFormContainer는 localStorage에 저장된 step 데이터를 불러와 최종 제출을 처리
export default function Page() {
  const router = useRouter();
  const { config: brand } = useBrand();

  return (
    <div className="h-screen bg-white flex flex-col min-h-0">
      <SiteHeader
        title="컨설팅 작성"
        showBackButton
        onBackClick={() => router.push(ROUTES.WEB_POSTS(brand.slug))}
      />
      <HairConsultationFormContainer />
    </div>
  );
}
