'use client';

import { HairTextureSelectPage } from '@/features/posts/pages/hair-texture-select-page';
import { useConsultationEditNavigation } from '@/features/posts/hooks/use-consultation-edit-navigation';

export default function Page() {
  const { onComplete, onBack } = useConsultationEditNavigation('hairTexture');
  return <HairTextureSelectPage onComplete={onComplete} onBack={onBack} />;
}
