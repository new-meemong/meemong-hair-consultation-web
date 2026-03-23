'use client';

import { PersonalColorSelectPage } from '@/features/posts/pages/personal-color-select-page';
import { useConsultationEditNavigation } from '@/features/posts/hooks/use-consultation-edit-navigation';

export default function Page() {
  const { onComplete, onBack } = useConsultationEditNavigation('personalColor');
  return <PersonalColorSelectPage onComplete={onComplete} onBack={onBack} />;
}
