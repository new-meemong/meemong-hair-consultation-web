'use client';

import { useConsultationNavigation } from '@/features/posts/hooks/use-consultation-navigation';
import { HairConcernsSelectPage } from '@/features/posts/pages/hair-concerns-select-page';

export default function Page() {
  const { goNext, goPrev } = useConsultationNavigation('hairConcerns');

  return <HairConcernsSelectPage onComplete={goNext} onBack={goPrev} />;
}
