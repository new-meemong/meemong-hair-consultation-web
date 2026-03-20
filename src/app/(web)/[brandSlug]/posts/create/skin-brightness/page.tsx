'use client';

import { useConsultationNavigation } from '@/features/posts/hooks/use-consultation-navigation';
import { SkinBrightnessSelectPage } from '@/features/posts/pages/skin-brightness-select-page';

export default function Page() {
  const { goNext, goPrev } = useConsultationNavigation('skinBrightness');

  return <SkinBrightnessSelectPage onComplete={goNext} onBack={goPrev} />;
}
