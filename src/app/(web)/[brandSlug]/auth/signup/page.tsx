'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { GenderSelector, type Gender } from '@/features/profile/ui/gender-selector';
import { useBrand } from '@/shared/context/brand-context';
import { ROUTES } from '@/shared/lib/routes';
import { createWebApiClient } from '@/shared/lib/web-api';
import { getWebUserData } from '@/shared/lib/auth';
import { SiteHeader } from '@/widgets/header/ui/site-header';

const SIGNUP_FORM_KEY = (slug: string) => `web_signup_form:${slug}`;

export default function SignupGenderPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config: brand } = useBrand();

  const isEditMode = searchParams.get('editMode') === 'true';
  const initialGender = (searchParams.get('gender') as Gender | null) ?? null;

  const [gender, setGender] = useState<Gender | null>(initialGender);

  const handleConfirm = async () => {
    if (!gender) return;

    if (isEditMode) {
      const token = getWebUserData(brand.slug)?.token;
      if (!token) {
        router.replace(ROUTES.WEB_AUTH_PHONE(brand.slug));
        return;
      }
      const api = createWebApiClient(token, brand.slug);
      await api.patch('models/me/my-page', { sex: gender === 'FEMALE' ? '여자' : '남자' });
      router.push(ROUTES.WEB_MY(brand.slug));
      return;
    }

    const existing = JSON.parse(sessionStorage.getItem(SIGNUP_FORM_KEY(brand.slug)) ?? '{}');
    sessionStorage.setItem(SIGNUP_FORM_KEY(brand.slug), JSON.stringify({ ...existing, gender }));
    router.push(ROUTES.WEB_AUTH_SIGNUP_REGION(brand.slug));
  };

  return (
    <div className="flex flex-col h-screen">
      <SiteHeader
        title={isEditMode ? '성별 수정' : '회원가입'}
        showBackButton
        onBackClick={() => router.back()}
      />

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
        <div className="flex items-start gap-2 mb-2">
          <p className="typo-headline-semibold text-label-strong">성별을 선택해주세요</p>
          <span className="typo-body-2-semibold text-cautionary shrink-0">필수</span>
        </div>
        <p className="typo-body-1-regular text-label-info mb-8">성별에 맞는 맞춤 상담지를 드려요</p>
        <GenderSelector value={gender} onChange={setGender} />
      </div>

      <div className="px-5 pb-8 shrink-0">
        <button
          type="button"
          disabled={!gender}
          className="w-full py-4 rounded-[4px] typo-body-1-medium bg-label-default text-white disabled:bg-label-disable disabled:text-label-placeholder"
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}
