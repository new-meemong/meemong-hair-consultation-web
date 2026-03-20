'use client';

import { useConsultationNavigation } from '@/features/posts/hooks/use-consultation-navigation';
import { HairTextureSelectPage } from '@/features/posts/pages/hair-texture-select-page';

export default function Page() {
  const { goNext, goPrev } = useConsultationNavigation('hairTexture');

  return <HairTextureSelectPage onComplete={goNext} onBack={goPrev} />;
}
