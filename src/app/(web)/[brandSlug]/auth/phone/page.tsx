'use client';

import { useEffect, useRef, useState } from 'react';

import { Input } from '@/shared/ui/input';
import { Loader } from '@/shared/ui/loader';
import { ROUTES } from '@/shared/lib/routes';
import { SiteHeader } from '@/widgets/header/ui/site-header';
import { apiClientWithoutAuth } from '@/shared/api/client';
import { createWebApiClient } from '@/shared/lib/web-api';
import { setWebUserData } from '@/shared/lib/auth';
import { useBrand } from '@/shared/context/brand-context';
import { useRouter } from 'next/navigation';

type SmsRequestData = {
  phoneNumber: string;
  token: string;
  expiredAt: string;
};

type LoginData = {
  id: number;
  token: string;
};

type LinkedUser = {
  id: number;
  displayName: string;
  createdAt: string;
  loginType: string;
  profilePictureURL: string | null;
};

async function fetchAndStoreSex(token: string, slug: string) {
  try {
    const api = createWebApiClient(token);
    const me = await api.get<{ id: number }>('models/me');
    const profile = await api.get<{ sex?: '남자' | '여자' }>(`models/${me.id}/my-page`);
    if (profile.sex) {
      setWebUserData(slug, { sex: profile.sex });
    }
  } catch {
    // my page에서 재시도
  }
}

function formatPhone(digits: string): string {
  if (digits.length <= 3) return digits;
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`;
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

export default function PhoneAuthPage() {
  const router = useRouter();
  const { config: brand } = useBrand();

  const [phoneDigits, setPhoneDigits] = useState('');
  const [phase, setPhase] = useState<'input' | 'verify'>('input');
  const [smsData, setSmsData] = useState<SmsRequestData | null>(null);
  const [code, setCode] = useState('');
  const [countdown, setCountdown] = useState(0);
  const [isSending, setIsSending] = useState(false);
  const [isVerifying, setIsVerifying] = useState(false);
  const [verifyError, setVerifyError] = useState(false);
  const codeInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (!smsData?.expiredAt) return;

    const tick = () => {
      const remaining = Math.max(
        0,
        Math.floor((new Date(smsData.expiredAt).getTime() - Date.now()) / 1000),
      );
      setCountdown(remaining);
    };
    tick();
    const interval = setInterval(tick, 1000);
    return () => clearInterval(interval);
  }, [smsData]);

  const sendCode = async () => {
    if (isSending || phoneDigits.length < 10) return;
    setIsSending(true);
    try {
      const response = await apiClientWithoutAuth.post<SmsRequestData>(
        'auth/phone/sms-auths/request',
        { phoneNumber: phoneDigits },
      );
      setSmsData(response.data);
      setCode('');
      setVerifyError(false);
      setPhase('verify');
      setTimeout(() => codeInputRef.current?.focus(), 100);
    } finally {
      setIsSending(false);
    }
  };

  const resendCode = async () => {
    if (isSending || phoneDigits.length < 10) return;
    setIsSending(true);
    try {
      const response = await apiClientWithoutAuth.post<SmsRequestData>(
        'auth/phone/sms-auths/request',
        { phoneNumber: phoneDigits },
      );
      setSmsData(response.data);
      setCode('');
      setVerifyError(false);
    } finally {
      setIsSending(false);
    }
  };

  const handleVerify = async () => {
    if (isVerifying || code.length !== 6 || !smsData) return;
    setIsVerifying(true);
    setVerifyError(false);
    try {
      const verifyResponse = await apiClientWithoutAuth.post<{ authToken: string }>(
        'auth/phone/sms-auths/verify',
        { phoneNumber: phoneDigits, token: smsData.token, code },
      );
      const authToken = verifyResponse.data.authToken;

      // 로그인 시도
      try {
        const loginResponse = await apiClientWithoutAuth.post<LoginData>('auth/phone/login', {
          phoneNumber: phoneDigits,
          authToken,
        });
        const loginData = loginResponse.data;

        setWebUserData(brand.slug, { userId: loginData.id, token: loginData.token });
        void fetchAndStoreSex(loginData.token, brand.slug);

        // 로그인 성공 → 바로 마이페이지
        router.push(ROUTES.WEB_MY(brand.slug));
      } catch {
        // 로그인 실패 → 해당 번호로 연동 계정 검색
        const modelResponse = await apiClientWithoutAuth.get<{ users: LinkedUser[] }>(
          'auth/phone/model',
          { searchParams: { authToken } },
        );
        const linkedUsers = modelResponse.data.users;

        sessionStorage.setItem(
          `web_signup_form:${brand.slug}`,
          JSON.stringify({ authToken, phoneNumber: phoneDigits }),
        );

        if (linkedUsers.length > 0) {
          // 연동할 계정 존재 → 계정 선택 페이지
          router.push(ROUTES.WEB_AUTH_LINK(brand.slug));
        } else {
          // 계정 없음 → 회원가입
          router.push(ROUTES.WEB_AUTH_SIGNUP(brand.slug));
        }
      }
    } catch {
      setVerifyError(true);
    } finally {
      setIsVerifying(false);
    }
  };

  const isPhoneValid = phoneDigits.length >= 10;
  const canVerify = code.length === 6 && !isVerifying;

  return (
    <div className="flex flex-col h-screen">
      <SiteHeader title="연락처 확인" showBackButton onBackClick={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
        {/* 타이틀 */}
        <div className="flex items-start gap-2 mb-8">
          <p className="typo-headline-semibold text-label-strong">
            컨설팅 답변을 받을 연락처를 입력해주세요
          </p>
          <span className="typo-body-2-semibold text-cautionary shrink-0">필수</span>
        </div>

        {/* 전화번호 입력 */}
        <div className="flex flex-col gap-2">
          <label className="typo-body-2-semibold text-label-default flex items-center gap-1">
            전화번호
            <span className="inline-block size-1 rounded-full bg-negative-light" />
          </label>
          <div className="border-b border-border-default pb-2">
            <Input
              type="tel"
              inputMode="numeric"
              placeholder="010-0000-0000"
              value={formatPhone(phoneDigits)}
              onChange={(e) => {
                const digits = e.target.value.replace(/\D/g, '').slice(0, 11);
                setPhoneDigits(digits);
              }}
            />
          </div>
        </div>

        {/* 인증번호 발송 버튼 (input 단계) */}
        {phase === 'input' && (
          <button
            type="button"
            disabled={!isPhoneValid || isSending}
            className="mt-4 w-full py-4 rounded-[4px] typo-body-1-medium bg-label-default text-white disabled:bg-label-disable disabled:text-label-placeholder flex items-center justify-center gap-2"
            onClick={sendCode}
          >
            {isSending && <Loader size="sm" theme="light" />}
            인증번호 발송
          </button>
        )}

        {/* 인증번호 입력 (verify 단계) */}
        {phase === 'verify' && (
          <>
            <div className="flex flex-col gap-2 mt-7">
              <label className="typo-body-2-semibold text-label-default flex items-center gap-1">
                인증번호
                <span className="inline-block size-1 rounded-full bg-negative-light" />
              </label>
              <div className="border-b border-border-default pb-2 flex items-center gap-2">
                <Input
                  ref={codeInputRef}
                  type="tel"
                  inputMode="numeric"
                  placeholder="인증번호 6자리를 입력해주세요"
                  value={code}
                  maxLength={6}
                  className="flex-1"
                  onChange={(e) => {
                    const digits = e.target.value.replace(/\D/g, '').slice(0, 6);
                    setCode(digits);
                    setVerifyError(false);
                  }}
                />
                <span className="typo-body-2-regular text-negative-light shrink-0">
                  {formatCountdown(countdown)}
                </span>
              </div>
              {verifyError && (
                <p className="typo-body-2-regular text-negative-light">
                  인증번호가 올바르지 않습니다.
                </p>
              )}
            </div>

            {/* 재전송 버튼 */}
            <button
              type="button"
              disabled={isSending}
              className="mt-3 w-full flex items-center justify-center gap-1 typo-body-2-medium text-label-sub disabled:text-label-disable"
              onClick={resendCode}
            >
              {isSending && <Loader size="sm" theme="dark" />}
              재전송
            </button>
          </>
        )}
      </div>

      {/* 인증완료 버튼 (하단 고정) */}
      {phase === 'verify' && (
        <div className="px-5 pb-8 shrink-0">
          <button
            type="button"
            disabled={!canVerify}
            className="w-full py-4 rounded-[4px] typo-body-1-medium bg-label-default text-white disabled:bg-label-disable disabled:text-label-placeholder flex items-center justify-center gap-2"
            onClick={handleVerify}
          >
            {isVerifying && <Loader size="sm" theme="light" />}
            인증완료
          </button>
        </div>
      )}
    </div>
  );
}
