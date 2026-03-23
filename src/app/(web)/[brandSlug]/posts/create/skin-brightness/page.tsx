'use client';

import { SkinBrightnessSelectPage } from '@/features/posts/pages/skin-brightness-select-page';
import { useConsultationEditNavigation } from '@/features/posts/hooks/use-consultation-edit-navigation';

export default function Page() {
  const { onComplete, onBack } = useConsultationEditNavigation('skinBrightness');
  return <SkinBrightnessSelectPage onComplete={onComplete} onBack={onBack} />;
}
