'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import { getCurrentPosition, reverseGeocodeToRegion } from '@/features/region/lib/kakao-geocoding';
import { RegionAddressInput } from '@/features/region/ui/region-address-input';
import { useBrand } from '@/shared/context/brand-context';
import { ROUTES } from '@/shared/lib/routes';
import { Loader } from '@/shared/ui/loader';
import { SiteHeader } from '@/widgets/header/ui/site-header';

const SIGNUP_FORM_KEY = (slug: string) => `web_signup_form:${slug}`;

export default function SignupRegionPage() {
  const router = useRouter();
  const { config: brand } = useBrand();

  const [regionKey, setRegionKey] = useState<string | null>(null);
  const [regionValue, setRegionValue] = useState<string | null>(null);
  const [searchOpen, setSearchOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);

  const regionDisplay = regionKey && regionValue ? `${regionKey} ${regionValue}` : null;

  useEffect(() => {
    requestCurrentLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const requestCurrentLocation = async () => {
    setIsLocating(true);
    try {
      const position = await getCurrentPosition();
      const region = await reverseGeocodeToRegion(
        position.coords.latitude,
        position.coords.longitude,
      );
      if (region) {
        setRegionKey(region.key);
        setRegionValue(region.value);
      }
    } catch {
      // 위치 권한 거부 또는 실패 시 무시 (수동 검색으로 대체)
    } finally {
      setIsLocating(false);
    }
  };

  const handleConfirm = () => {
    if (!regionKey || !regionValue) return;
    const existing = JSON.parse(sessionStorage.getItem(SIGNUP_FORM_KEY(brand.slug)) ?? '{}');
    sessionStorage.setItem(
      SIGNUP_FORM_KEY(brand.slug),
      JSON.stringify({ ...existing, region: { key: regionKey, value: regionValue } }),
    );
    router.push(ROUTES.WEB_AUTH_SIGNUP_TERMS(brand.slug));
  };

  return (
    <div className="flex flex-col h-screen">
      <SiteHeader title="회원가입" showBackButton onBackClick={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
        <div className="flex items-start gap-2 mb-2">
          <p className="typo-headline-semibold text-label-strong">
            미용실을 추천 받을 지역을 선택해주세요
          </p>
          <span className="typo-body-2-semibold text-cautionary shrink-0">필수</span>
        </div>
        <p className="typo-body-1-regular text-label-info mb-8">
          근처의 디자이너에게 우선적으로 답변을 받아요
        </p>

        <div className="flex flex-col gap-2">
          <label className="typo-body-2-semibold text-label-default flex items-center gap-1">
            지역
            <span className="inline-block size-1 rounded-full bg-negative-light" />
          </label>
          <RegionAddressInput
            value={regionDisplay}
            searchOpen={searchOpen}
            onSearchOpenChange={setSearchOpen}
            onChange={(key, value) => {
              setRegionKey(key);
              setRegionValue(value);
            }}
          />
        </div>
      </div>

      <div className="px-5 pb-8 shrink-0 flex flex-col gap-3">
        <button
          type="button"
          disabled={isLocating}
          className="w-full py-4 rounded-[4px] typo-body-1-medium border border-border-default text-label-default disabled:text-label-placeholder flex items-center justify-center gap-2"
          onClick={requestCurrentLocation}
        >
          {isLocating && <Loader size="sm" theme="dark" />}
          현재위치로 설정
        </button>
        <button
          type="button"
          className="w-full py-4 rounded-[4px] typo-body-1-medium bg-label-default text-white"
          onClick={() => setSearchOpen(true)}
        >
          주소검색
        </button>
        <button
          type="button"
          disabled={!regionDisplay}
          className="w-full py-4 rounded-[4px] typo-body-1-medium bg-label-default text-white disabled:bg-label-disable disabled:text-label-placeholder"
          onClick={handleConfirm}
        >
          확인
        </button>
      </div>
    </div>
  );
}
