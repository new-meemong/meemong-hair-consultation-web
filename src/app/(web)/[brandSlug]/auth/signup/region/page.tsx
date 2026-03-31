'use client';

import {
  KAKAO_CITY_NORMALIZE,
  getCurrentPosition,
  reverseGeocodeToRegion,
} from '@/features/region/lib/kakao-geocoding';
import { useCallback, useEffect, useRef, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

import { Loader } from '@/shared/ui/loader';
import { ROUTES } from '@/shared/lib/routes';
import Script from 'next/script';
import { SiteHeader } from '@/widgets/header/ui/site-header';
import { createWebApiClient } from '@/shared/lib/web-api';
import { getWebUserData } from '@/shared/lib/auth';
import { useBrand } from '@/shared/context/brand-context';

const SIGNUP_FORM_KEY = (slug: string) => `web_signup_form:${slug}`;

declare global {
  interface Window {
    daum: {
      Postcode: new (options: {
        oncomplete: (data: { sido: string; sigungu: string }) => void;
        width?: string;
        height?: string;
      }) => { embed: (el: HTMLElement) => void };
    };
  }
}

export default function SignupRegionPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { config: brand } = useBrand();
  const postcodeContainerRef = useRef<HTMLDivElement>(null);

  const isEditMode = searchParams.get('editMode') === 'true';

  const [regionKey, setRegionKey] = useState<string | null>(searchParams.get('regionKey') ?? null);
  const [regionValue, setRegionValue] = useState<string | null>(
    searchParams.get('regionValue') ?? null,
  );
  const [postcodeOpen, setPostcodeOpen] = useState(false);
  const [isLocating, setIsLocating] = useState(false);
  const [scriptLoaded, setScriptLoaded] = useState(false);

  // 뒤로가기 후 재진입 시 스크립트가 이미 로드된 경우 처리
  useEffect(() => {
    if (window.daum?.Postcode) setScriptLoaded(true);
  }, []);

  const regionDisplay = regionKey && regionValue ? `${regionKey} ${regionValue}` : null;

  const requestCurrentLocation = useCallback(async () => {
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
      // 위치 권한 거부 또는 실패 시 무시
    } finally {
      setIsLocating(false);
    }
  }, []);

  const openPostcode = useCallback(() => {
    if (!scriptLoaded || !postcodeContainerRef.current) return;
    postcodeContainerRef.current.innerHTML = '';
    new window.daum.Postcode({
      oncomplete: (data) => {
        const sido = KAKAO_CITY_NORMALIZE[data.sido] ?? data.sido;
        setRegionKey(sido);
        setRegionValue(data.sigungu);
        setPostcodeOpen(false);
      },
      width: '100%',
      height: '100%',
    }).embed(postcodeContainerRef.current);
    setPostcodeOpen(true);
  }, [scriptLoaded]);

  const handleConfirm = async () => {
    if (!regionKey || !regionValue) return;

    if (isEditMode) {
      const token = getWebUserData(brand.slug)?.token;
      if (!token) {
        router.replace(ROUTES.WEB_AUTH_PHONE(brand.slug));
        return;
      }
      const api = createWebApiClient(token, brand.slug);
      await api.patch('models/me/my-page', { address: `${regionKey} ${regionValue}` });
      router.push(ROUTES.WEB_MY(brand.slug));
      return;
    }

    const existing = JSON.parse(sessionStorage.getItem(SIGNUP_FORM_KEY(brand.slug)) ?? '{}');
    sessionStorage.setItem(
      SIGNUP_FORM_KEY(brand.slug),
      JSON.stringify({ ...existing, region: { key: regionKey, value: regionValue } }),
    );
    router.push(ROUTES.WEB_AUTH_SIGNUP_TERMS(brand.slug));
  };

  return (
    <>
      <Script
        src="https://t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js"
        strategy="afterInteractive"
        onLoad={() => setScriptLoaded(true)}
      />

      <div className="flex flex-col h-screen">
        <SiteHeader
          title={isEditMode ? '추천지역 수정' : '회원가입'}
          showBackButton
          onBackClick={() => (postcodeOpen ? setPostcodeOpen(false) : router.back())}
        />

        {/* 카카오 우편번호 검색 오버레이 */}
        <div
          className="absolute inset-0 z-50 flex flex-col bg-white"
          style={{ top: 56, display: postcodeOpen ? 'flex' : 'none' }}
        >
          <div ref={postcodeContainerRef} className="flex-1 w-full" />
        </div>

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
              주소 검색
              <span className="inline-block size-1 rounded-full bg-negative-light" />
            </label>
            <button
              type="button"
              onClick={openPostcode}
              className="w-full text-left px-4 py-3 border-b border-border-default typo-body-1-regular flex items-center justify-between"
            >
              {regionDisplay ? (
                <span className="text-label-strong">{regionDisplay}</span>
              ) : (
                <span className="text-label-placeholder">지역을 검색해주세요</span>
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-label-info shrink-0"
              >
                <circle cx="11" cy="11" r="8" />
                <line x1="21" y1="21" x2="16.65" y2="16.65" />
              </svg>
            </button>
            <button
              type="button"
              disabled={isLocating}
              className="w-full py-3 rounded-[4px] typo-body-1-medium border border-border-default text-label-default disabled:text-label-placeholder flex items-center justify-center gap-2"
              onClick={requestCurrentLocation}
            >
              {isLocating && <Loader size="sm" theme="dark" />}
              현재위치로 설정
            </button>
          </div>
        </div>

        <div className="px-5 pb-8 shrink-0">
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
    </>
  );
}
