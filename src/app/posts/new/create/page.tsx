'use client';

import HairConsultationFormContainer from '@/widgets/post/ui/consulting-post/hair-consultation-form-container';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useShowGuide from '@/shared/hooks/use-show-guide';
import { useState } from 'react';

export default function CreateHairConsultationPage() {
  useShowGuide(USER_GUIDE_KEYS.hasSeenCreatePostGuide);

  const [initialHeight] = useState(() => window.innerHeight);

  return (
    <div className="h-screen bg-white flex flex-col min-h-0" style={{ minHeight: initialHeight }}>
      <HairConsultationFormContainer />
    </div>
  );
}
