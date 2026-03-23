'use client';

import { useEffect, useState } from 'react';

import Checkbox from '@/shared/ui/checkbox';
import Image from 'next/image';
import { Loader } from '@/shared/ui/loader';
import { ROUTES } from '@/shared/lib/routes';
import { SiteHeader } from '@/widgets/header/ui/site-header';
import { apiClientWithoutAuth } from '@/shared/api/client';
import { useBrand } from '@/shared/context/brand-context';
import { useRouter } from 'next/navigation';

type LinkedUser = {
  id: number;
  displayName: string;
  createdAt: string;
  loginType: string;
  profilePictureURL: string | null;
};

const LOGIN_TYPE_LABEL: Record<string, string> = {
  GOOGLE: '구글',
  APPLE: '애플',
  KAKAO: '카카오',
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, '0');
  const dd = String(d.getDate()).padStart(2, '0');
  return `${yyyy}.${mm}.${dd}`;
}

const SIGNUP_FORM_KEY = (slug: string) => `web_signup_form:${slug}`;

export default function AccountLinkPage() {
  const router = useRouter();
  const { config: brand } = useBrand();

  const [users, setUsers] = useState<LinkedUser[]>([]);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const formData = JSON.parse(sessionStorage.getItem(SIGNUP_FORM_KEY(brand.slug)) ?? '{}');
    const authToken = formData.authToken;
    if (!authToken) {
      router.replace(ROUTES.WEB_AUTH_PHONE(brand.slug));
      return;
    }

    apiClientWithoutAuth
      .get<{ users: LinkedUser[] }>('auth/phone/model', { searchParams: { authToken } })
      .then((res) => setUsers(res.data.users))
      .catch(() => router.replace(ROUTES.WEB_AUTH_PHONE(brand.slug)))
      .finally(() => setIsLoading(false));
  }, [brand.slug, router]);

  const handleSubmit = async () => {
    if (!selectedId || isSubmitting) return;
    setIsSubmitting(true);
    try {
      const formData = JSON.parse(sessionStorage.getItem(SIGNUP_FORM_KEY(brand.slug)) ?? '{}');
      const response = await apiClientWithoutAuth.post<{ id: number; token: string }>(
        'auth/phone/model-connect',
        { authToken: formData.authToken, userId: selectedId },
      );

      // TODO: Phase 3 WebAuthProvider — store web_user_data:${brand.slug}
      localStorage.setItem(
        `web_user_data:${brand.slug}`,
        JSON.stringify({ userId: response.data.id, token: response.data.token }),
      );
      sessionStorage.removeItem(SIGNUP_FORM_KEY(brand.slug));
      router.push(ROUTES.WEB_MY(brand.slug));
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="flex flex-col h-screen">
      <SiteHeader title="미몽 계정연결" showBackButton onBackClick={() => router.back()} />

      <div className="flex-1 overflow-y-auto px-5 pt-8 pb-6">
        <div className="flex items-start gap-2 mb-2">
          <p className="typo-headline-semibold text-label-strong">
            미몽 회원이시네요! 더 빠른 진행이 가능해요
          </p>
          <span className="typo-body-2-semibold text-cautionary shrink-0">필수</span>
        </div>
        <p className="typo-body-1-regular text-label-info mb-8">연결할 계정을 선택해주세요</p>

        {isLoading ? (
          <div className="flex justify-center py-16">
            <Loader size="md" theme="dark" />
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {users.map((user) => (
              <button
                key={user.id}
                type="button"
                className="flex items-center gap-4 p-4 border border-border-default rounded-[6px] text-left"
                onClick={() => setSelectedId(user.id)}
              >
                {/* 프로필 이미지 */}
                <div className="shrink-0 size-[82px] rounded-[6px] overflow-hidden bg-alternative">
                  {user.profilePictureURL ? (
                    <Image
                      src={user.profilePictureURL}
                      alt={user.displayName}
                      width={82}
                      height={82}
                      className="size-full object-cover"
                    />
                  ) : (
                    <div className="size-full bg-alternative" />
                  )}
                </div>

                {/* 유저 정보 */}
                <div className="flex-1 min-w-0">
                  <p className="typo-headline-semibold text-label-strong truncate">
                    {user.displayName}
                  </p>
                  <p className="typo-body-2-longregular text-label-info mt-1">
                    가입일: {formatDate(user.createdAt)}
                  </p>
                  <p className="typo-body-2-longregular text-label-info">
                    소셜로그인: {LOGIN_TYPE_LABEL[user.loginType] ?? user.loginType}
                  </p>
                </div>

                {/* 체크박스 */}
                <Checkbox
                  shape="round"
                  id={`user-${user.id}`}
                  checked={selectedId === user.id}
                  onChange={() => setSelectedId(user.id)}
                  onClick={(e) => e.stopPropagation()}
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="px-5 pb-8 shrink-0">
        <button
          type="button"
          disabled={!selectedId || isSubmitting}
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
