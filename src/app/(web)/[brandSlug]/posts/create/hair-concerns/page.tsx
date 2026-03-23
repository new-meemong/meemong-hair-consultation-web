'use client';

import { HairConcernsSelectPage } from '@/features/posts/pages/hair-concerns-select-page';
import { useConsultationEditNavigation } from '@/features/posts/hooks/use-consultation-edit-navigation';

export default function Page() {
  const { onComplete, onBack } = useConsultationEditNavigation('hairConcerns');
  return <HairConcernsSelectPage onComplete={onComplete} onBack={onBack} />;
}
