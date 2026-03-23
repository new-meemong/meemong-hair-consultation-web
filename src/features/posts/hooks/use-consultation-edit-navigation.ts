'use client';

import { useRouter, useSearchParams } from 'next/navigation';

import {
  WEB_HAIR_CONSULTATION_CONTENT_KEY,
  WEB_USER_DATA_KEY,
} from '@/shared/constants/local-storage';
import { type StepId } from '@/shared/constants/consultation-steps';
import { ROUTES } from '@/shared/lib/routes';
import { createWebApiClient } from '@/shared/lib/web-api';
import { useBrand } from '@/shared/context/brand-context';
import { useConsultationNavigation } from './use-consultation-navigation';

export function useConsultationEditNavigation(stepId: StepId) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('editMode') === 'true';
  const { goNext, goPrev } = useConsultationNavigation(stepId);
  const router = useRouter();
  const { config } = useBrand();

  if (!isEditMode) {
    return { onComplete: goNext, onBack: goPrev };
  }

  const onComplete = async () => {
    const raw = localStorage.getItem(WEB_HAIR_CONSULTATION_CONTENT_KEY);
    const value = raw ? JSON.parse(raw)?.content?.[stepId] : null;
    const userData = JSON.parse(localStorage.getItem(WEB_USER_DATA_KEY(config.slug)) ?? '{}');
    const api = createWebApiClient(userData.token);
    await api.patch('models/me', { [stepId]: value });
    router.push(ROUTES.WEB_MY(config.slug));
  };

  const onBack = () => router.push(ROUTES.WEB_MY(config.slug));

  return { onComplete, onBack };
}
