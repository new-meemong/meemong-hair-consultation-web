'use client';

import { useRouter } from 'next/navigation';

import { type StepId } from '@/shared/constants/consultation-steps';
import { useBrand } from '@/shared/context/brand-context';
import { getConsultationFlow } from '@/shared/lib/get-consultation-flow';
import { ROUTES } from '@/shared';
import { getNextStep, getPrevStep } from '../lib/consultation-flow';

// (web)/[brandSlug] 레이아웃 내에서만 사용 가능 (BrandProvider 필요)
export function useConsultationNavigation(currentStepId: StepId) {
  const router = useRouter();
  const { config } = useBrand();
  const flow = getConsultationFlow(config);

  return {
    goNext: () => {
      const next = getNextStep(flow, currentStepId);
      if (next) {
        router.push(ROUTES.WEB_CONSULTATION_STEP(config.slug, next.stepId));
      } else {
        router.push(ROUTES.WEB_CONSULTATION_COMPLETE(config.slug));
      }
    },
    goPrev: () => {
      const prev = getPrevStep(flow, currentStepId);
      if (prev) {
        router.push(ROUTES.WEB_CONSULTATION_STEP(config.slug, prev.stepId));
      } else {
        router.push(ROUTES.WEB_POSTS(config.slug));
      }
    },
  };
}
