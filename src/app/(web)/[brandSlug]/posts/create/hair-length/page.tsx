'use client';

import { useConsultationNavigation } from '@/features/posts/hooks/use-consultation-navigation';
import { HairLengthSelectPage } from '@/features/posts/pages/hair-length-select-page';

export default function Page() {
  const { goNext, goPrev } = useConsultationNavigation('hairLength');

  return <HairLengthSelectPage onComplete={goNext} onBack={goPrev} />;
}
