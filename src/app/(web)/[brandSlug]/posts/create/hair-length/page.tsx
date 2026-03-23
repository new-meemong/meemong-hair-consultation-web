'use client';

import { HairLengthSelectPage } from '@/features/posts/pages/hair-length-select-page';
import { useConsultationEditNavigation } from '@/features/posts/hooks/use-consultation-edit-navigation';

export default function Page() {
  const { onComplete, onBack } = useConsultationEditNavigation('hairLength');
  return <HairLengthSelectPage onComplete={onComplete} onBack={onBack} />;
}
