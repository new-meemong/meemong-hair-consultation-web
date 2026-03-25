'use client';

import Checkbox from '@/shared/ui/checkbox';
import { Loader } from '@/shared/ui/loader';
import { ROUTES } from '@/shared/lib/routes';
import { SiteHeader } from '@/widgets/header/ui/site-header';
import { apiClientWithoutAuth } from '@/shared/api/client';
import { setWebUserData } from '@/shared/lib/auth';
import { useBrand } from '@/shared/context/brand-context';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

const SIGNUP_FORM_KEY = (slug: string) => `web_signup_form:${slug}`;

export default function SignupTermsPage() {
  const router = useRouter();
  const { config: brand } = useBrand();

  const [termsService, setTermsService] = useState(false);
  const [termsPrivacy, setTermsPrivacy] = useState(false);
  const [termsMarketing, setTermsMarketing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const allChecked = termsService && termsPrivacy && termsMarketing;
  const canSubmit = termsService && termsPrivacy;

  const handleToggleAll = () => {
    const next = !allChecked;
    setTermsService(next);
    setTermsPrivacy(next);
    setTermsMarketing(next);
  };

  const handleSubmit = async () => {
    if (!canSubmit || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = JSON.parse(sessionStorage.getItem(SIGNUP_FORM_KEY(brand.slug)) ?? '{}');
      const response = await apiClientWithoutAuth.post<{
        id: number;
        token: string;
        MongMoney: null;
      }>('auth/phone/register/model', {
        authToken: formData.authToken,
        phoneNumber: formData.phoneNumber,
        sex: formData.gender === 'FEMALE' ? '여자' : '남자',
        address: `${formData.region.key} ${formData.region.value}`,
        agreementAdvertisement: termsMarketing,
      });

      setWebUserData(brand.slug, {
        userId: response.data.id,
        token: response.data.token,
        sex: formData.gender === 'FEMALE' ? '여자' : '남자',
      });
      sessionStorage.removeItem(SIGNUP_FORM_KEY(brand.slug));
      router.push(ROUTES.WEB_MY(brand.slug));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <SiteHeader title="회원가입" showBackButton onBackClick={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
        <div className="flex items-start gap-2 mb-8">
          <p className="typo-headline-semibold text-label-strong">
            컨설팅 진행을 위한 약관에 동의해주세요
          </p>
          <span className="typo-body-2-semibold text-cautionary shrink-0">필수</span>
        </div>

        {/* 전체동의 */}
        <button
          type="button"
          className="w-full flex items-center gap-3 py-4 border-b-2 border-border-default"
          onClick={handleToggleAll}
        >
          <Checkbox
            shape="round"
            id="terms-all"
            checked={allChecked}
            onChange={handleToggleAll}
            onClick={(e) => e.stopPropagation()}
          />
          <span className="typo-body-1-semibold text-label-default">전체동의</span>
        </button>

        {/* 개별 약관 */}
        <TermsRow
          id="terms-service"
          label="미몽 서비스 이용약관"
          badge="필수"
          checked={termsService}
          onChange={() => setTermsService((v) => !v)}
        />
        <TermsRow
          id="terms-privacy"
          label="개인정보 수집 및 이용안내"
          badge="필수"
          checked={termsPrivacy}
          onChange={() => setTermsPrivacy((v) => !v)}
        />
        <TermsRow
          id="terms-marketing"
          label="마케팅 정보수신 동의"
          badge="선택"
          checked={termsMarketing}
          onChange={() => setTermsMarketing((v) => !v)}
        />
      </div>

      <div className="px-5 pb-8 shrink-0">
        <button
          type="button"
          disabled={!canSubmit || isSubmitting}
          className="w-full py-4 rounded-[4px] typo-body-1-medium bg-label-default text-white disabled:bg-label-disable disabled:text-label-placeholder flex items-center justify-center gap-2"
          onClick={handleSubmit}
        >
          {isSubmitting && <Loader size="sm" theme="light" />}
          컨설팅 시작하기
        </button>
      </div>
    </div>
  );
}

function TermsRow({
  id,
  label,
  badge,
  checked,
  onChange,
}: {
  id: string;
  label: string;
  badge: '필수' | '선택';
  checked: boolean;
  onChange: () => void;
}) {
  return (
    <button
      type="button"
      className="w-full flex items-center gap-3 py-4 border-b border-border-default"
      onClick={onChange}
    >
      <Checkbox
        shape="round"
        id={id}
        checked={checked}
        onChange={onChange}
        onClick={(e) => e.stopPropagation()}
      />
      <span className="flex-1 text-left typo-body-1-regular text-label-default">
        {label}
        <span className="ml-1 typo-body-2-regular text-label-info">({badge})</span>
      </span>
    </button>
  );
}
