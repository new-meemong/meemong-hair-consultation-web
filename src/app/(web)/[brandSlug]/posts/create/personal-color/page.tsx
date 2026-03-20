'use client';

import { useConsultationNavigation } from '@/features/posts/hooks/use-consultation-navigation';
import { PersonalColorSelectPage } from '@/features/posts/pages/personal-color-select-page';

export default function Page() {
  const { goNext, goPrev } = useConsultationNavigation('personalColor');

  return <PersonalColorSelectPage onComplete={goNext} onBack={goPrev} />;
}
