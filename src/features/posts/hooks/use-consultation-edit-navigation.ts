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

export function useConsultationEditNavigation(stepId: StepId) {
  const searchParams = useSearchParams();
  const isEditMode = searchParams.get('editMode') === 'true';
  const router = useRouter();
  const { config } = useBrand();

  // 마이페이지에서 수정하는 경우: API 저장 후 마이페이지 복귀
  if (isEditMode) {
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

  // 폼에서 진입한 경우: 폼으로 복귀 (비브랜드 webview와 동일한 패턴)
  const backToForm = () =>
    router.replace(`${ROUTES.WEB_POSTS_CREATE(config.slug)}?skipReload=1`);

  return { onComplete: backToForm, onBack: backToForm };
}
