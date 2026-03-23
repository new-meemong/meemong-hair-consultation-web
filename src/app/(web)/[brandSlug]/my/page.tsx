'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import ShareIcon from '@/assets/icons/share.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import { GenderSelector, type Gender } from '@/features/profile/ui/gender-selector';
import { RegionAddressInput } from '@/features/region/ui/region-address-input';
import { useBrand } from '@/shared/context/brand-context';
import { ROUTES } from '@/shared/lib/routes';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Button } from '@/shared/ui/button';
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import { Loader } from '@/shared/ui/loader';

const WEB_USER_KEY = (slug: string) => `web_user_data:${slug}`;

type UserProfile = {
  sex?: '여자' | '남자';
  phoneNumber?: string;
  address?: string;
  hairLength?: string;
  hairConcerns?: string[];
  hairTexture?: string;
  skinBrightness?: string;
  personalColor?: string;
};

type InProgressConsultation = {
  id: string;
  brandName: string;
  totalSteps: number;
  completedSteps: number;
  startedAt: string;
  currentStep: string;
};

type SentConsultation = {
  id: string;
  title: string;
  createdAt: string;
  maxAmount: number;
  viewCount: number;
  commentCount: number;
  brandName: string;
};

function formatDate(dateStr: string): string {
  const d = new Date(dateStr);
  return `${d.getFullYear()}.${String(d.getMonth() + 1).padStart(2, '0')}.${String(d.getDate()).padStart(2, '0')}`;
}

function formatAmount(amount: number): string {
  return `최대 ${amount.toLocaleString('ko-KR')}원`;
}

export default function MyPage() {
  const router = useRouter();
  const { config: brand } = useBrand();

  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [inProgress, _setInProgress] = useState<InProgressConsultation | null>(null);
  const [sentConsultations, _setSentConsultations] = useState<SentConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // 성별 수정
  const [genderEditOpen, setGenderEditOpen] = useState(false);
  const [editGender, setEditGender] = useState<Gender | null>(null);
  const [isSavingGender, setIsSavingGender] = useState(false);

  // 추천지역 수정
  const [regionEditOpen, setRegionEditOpen] = useState(false);
  const [regionSearchOpen, setRegionSearchOpen] = useState(false);
  const [editRegionKey, setEditRegionKey] = useState<string | null>(null);
  const [editRegionValue, setEditRegionValue] = useState<string | null>(null);
  const [isSavingRegion, setIsSavingRegion] = useState(false);

  const editRegionDisplay =
    editRegionKey && editRegionValue ? `${editRegionKey} ${editRegionValue}` : null;

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(WEB_USER_KEY(brand.slug)) ?? '{}');
    if (!userData.userId || !userData.token) {
      router.replace(ROUTES.WEB_AUTH_PHONE(brand.slug));
      return;
    }

    // TODO: GET /api/v1/users/{userId} - 유저 프로필 조회
    // TODO: GET /api/v1/posts?status=draft&userId={userId} - 작성중인 상담지 조회
    // TODO: GET /api/v1/posts?status=published&userId={userId} - 보낸 상담지 조회
    setIsLoading(false);
  }, [brand.slug, router]);

  const handleShare = async () => {
    const url = `${window.location.origin}${ROUTES.WEB_WELCOME(brand.slug)}`;
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
      // TODO: 복사 완료 토스트 표시
    }
  };

  const handleOpenGenderEdit = () => {
    setEditGender(profile?.sex === '여자' ? 'FEMALE' : profile?.sex === '남자' ? 'MALE' : null);
    setGenderEditOpen(true);
  };

  const handleSaveGender = async () => {
    if (!editGender) return;
    setIsSavingGender(true);
    try {
      // TODO: PATCH /api/v1/users/{userId} { sex: editGender === 'FEMALE' ? '여자' : '남자' }
      setProfile((prev) => ({ ...prev, sex: editGender === 'FEMALE' ? '여자' : '남자' }));
      setGenderEditOpen(false);
    } finally {
      setIsSavingGender(false);
    }
  };

  const handleOpenRegionEdit = () => {
    if (profile?.address) {
      const parts = profile.address.split(' ');
      setEditRegionKey(parts[0] ?? null);
      setEditRegionValue(parts[1] ?? null);
    } else {
      setEditRegionKey(null);
      setEditRegionValue(null);
    }
    setRegionEditOpen(true);
  };

  const handleSaveRegion = async () => {
    if (!editRegionKey || !editRegionValue) return;
    setIsSavingRegion(true);
    try {
      // TODO: PATCH /api/v1/users/{userId} { address: `${editRegionKey} ${editRegionValue}` }
      setProfile((prev) => ({ ...prev, address: `${editRegionKey} ${editRegionValue}` }));
      setRegionEditOpen(false);
    } finally {
      setIsSavingRegion(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="md" theme="dark" />
      </div>
    );
  }

  return (
    <>
      <div className="flex flex-col h-screen">
        {/* 헤더 */}
        <div className="shrink-0 flex items-center justify-between px-5 h-14 border-b border-border-default bg-white">
          <span className="typo-title-2-bold text-static-black">{brand.name}</span>
          <button type="button" onClick={handleShare} className="p-1">
            <ShareIcon className="size-6 fill-label-default" />
          </button>
        </div>

        {/* 스크롤 영역 */}
        <div className="flex-1 overflow-y-auto pb-24">
          {/* 작성중인 상담지 */}
          {inProgress ? (
            <section className="px-5 py-6 border-b border-border-default">
              <p className="typo-body-2-semibold text-label-default mb-4">작성중인 상담지</p>
              <InProgressCard consultation={inProgress} brandSlug={brand.slug} />
            </section>
          ) : null}

          {/* 내 정보 */}
          <section className="px-5 py-6 border-b border-border-default">
            <p className="typo-body-2-semibold text-label-default mb-4">내 정보</p>
            <div className="flex flex-col">
              <InfoRow label="성별" value={profile?.sex} onEdit={handleOpenGenderEdit} />
              <InfoRow
                label="연락처"
                value={
                  profile?.phoneNumber
                    ? profile.phoneNumber.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3')
                    : undefined
                }
                onEdit={() => {
                  /* TODO: 연락처 수정 */
                }}
              />
              <InfoRow label="추천지역" value={profile?.address} onEdit={handleOpenRegionEdit} />
              <InfoRow
                label="머리기장"
                value={profile?.hairLength}
                onEdit={() => {
                  /* TODO: 머리기장 수정 */
                }}
              />
              <InfoRow
                label="헤어고민"
                value={profile?.hairConcerns?.join(', ')}
                onEdit={() => {
                  /* TODO: 헤어고민 수정 */
                }}
              />
              <InfoRow
                label="모발타입"
                value={profile?.hairTexture}
                onEdit={() => {
                  /* TODO: 모발타입 수정 */
                }}
              />
              <InfoRow
                label="피부톤"
                value={profile?.skinBrightness}
                onEdit={() => {
                  /* TODO: 피부톤 수정 */
                }}
              />
              <InfoRow
                label="퍼스널컬러"
                value={profile?.personalColor}
                onEdit={() => {
                  /* TODO: 퍼스널컬러 수정 */
                }}
              />
            </div>
          </section>

          {/* 보낸 상담지 */}
          <section className="px-5 py-6">
            <p className="typo-body-2-semibold text-label-default mb-4">보낸 상담지</p>
            {sentConsultations.length === 0 ? (
              <p className="py-8 text-center typo-body-1-regular text-label-placeholder">
                아직 보낸 상담지가 없어요
              </p>
            ) : (
              <div className="flex flex-col gap-3">
                {sentConsultations.map((c) => (
                  <SentConsultationCard key={c.id} consultation={c} />
                ))}
              </div>
            )}
          </section>
        </div>

        {/* 새 컨설팅 시작하기 (하단 고정) */}
        <div className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-2xl px-5 pb-8 bg-white pt-3 border-t border-border-default">
          <button
            type="button"
            className="w-full py-4 rounded-[4px] typo-body-1-medium bg-label-default text-white"
            onClick={() => router.push(ROUTES.WEB_AUTH_PHONE(brand.slug))}
          >
            새 컨설팅 시작하기
          </button>
        </div>
      </div>

      {/* 성별 수정 바텀시트 */}
      <BottomSheet
        id="gender-edit-sheet"
        open={genderEditOpen}
        onClose={() => setGenderEditOpen(false)}
        hideHandle
        className="gap-6 pt-6"
      >
        <DrawerHeader>
          <DrawerTitle>성별 수정</DrawerTitle>
        </DrawerHeader>
        <GenderSelector value={editGender} onChange={setEditGender} />
        <DrawerFooter
          className="pb-6"
          buttons={[
            <DrawerClose asChild key="cancel">
              <Button theme="white" size="lg" className="w-full rounded-[4px]">
                취소
              </Button>
            </DrawerClose>,
            <Button
              key="save"
              theme="black"
              size="lg"
              className="w-full rounded-[4px]"
              disabled={!editGender || isSavingGender}
              onClick={handleSaveGender}
            >
              {isSavingGender && <Loader size="sm" theme="light" />}
              저장
            </Button>,
          ]}
        />
      </BottomSheet>

      {/* 추천지역 수정 바텀시트 */}
      <BottomSheet
        id="region-edit-sheet"
        open={regionEditOpen}
        onClose={() => setRegionEditOpen(false)}
        hideHandle
        className="gap-4 pt-6"
      >
        <DrawerHeader>
          <DrawerTitle>추천지역 수정</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col gap-2">
          <RegionAddressInput
            value={editRegionDisplay}
            searchOpen={regionSearchOpen}
            onSearchOpenChange={setRegionSearchOpen}
            onChange={(key, value) => {
              setEditRegionKey(key);
              setEditRegionValue(value);
            }}
          />
          <button
            type="button"
            className="w-full py-4 rounded-[4px] typo-body-1-medium bg-label-default text-white"
            onClick={() => setRegionSearchOpen(true)}
          >
            주소검색
          </button>
        </div>
        <DrawerFooter
          className="pb-6"
          buttons={[
            <DrawerClose asChild key="cancel">
              <Button theme="white" size="lg" className="w-full rounded-[4px]">
                취소
              </Button>
            </DrawerClose>,
            <Button
              key="save"
              theme="black"
              size="lg"
              className="w-full rounded-[4px]"
              disabled={!editRegionDisplay || isSavingRegion}
              onClick={handleSaveRegion}
            >
              {isSavingRegion && <Loader size="sm" theme="light" />}
              저장
            </Button>,
          ]}
        />
      </BottomSheet>
    </>
  );
}

function InfoRow({
  label,
  value,
  onEdit,
}: {
  label: string;
  value: string | undefined;
  onEdit: () => void;
}) {
  return (
    <button
      type="button"
      className="flex items-center justify-between py-4 border-b border-border-default text-left"
      onClick={onEdit}
    >
      <span className="typo-body-2-semibold text-label-default">{label}</span>
      <div className="flex items-center gap-2">
        <span className="typo-body-1-regular text-label-info">{value ?? '-'}</span>
        <ChevronRightIcon className="size-4 fill-label-placeholder shrink-0" />
      </div>
    </button>
  );
}

function InProgressCard({
  consultation,
  brandSlug,
}: {
  consultation: InProgressConsultation;
  brandSlug: string;
}) {
  const router = useRouter();
  const remaining = consultation.totalSteps - consultation.completedSteps;

  return (
    <div className="border border-border-default rounded-[8px] p-4">
      <div className="flex items-center justify-between mb-3">
        <span className="typo-body-2-semibold text-label-default">{consultation.brandName}</span>
        <span className="typo-body-2-regular text-label-info">
          {formatDate(consultation.startedAt)} 시작
        </span>
      </div>

      {/* 진행률 */}
      <div className="mb-2">
        <div className="flex justify-between typo-body-2-regular text-label-info mb-1">
          <span>완료 {consultation.completedSteps}문항</span>
          <span>{remaining}문항 남았어요</span>
        </div>
        <div className="h-1.5 bg-alternative rounded-full overflow-hidden">
          <div
            className="h-full bg-label-default rounded-full"
            style={{
              width: `${(consultation.completedSteps / consultation.totalSteps) * 100}%`,
            }}
          />
        </div>
      </div>

      <button
        type="button"
        className="mt-3 w-full py-3 rounded-[4px] typo-body-2-medium bg-label-default text-white"
        onClick={() => router.push(ROUTES.WEB_POSTS_CREATE(brandSlug))}
      >
        이어서 작성하기
      </button>
    </div>
  );
}

function SentConsultationCard({ consultation }: { consultation: SentConsultation }) {
  return (
    <div className="border border-border-default rounded-[8px] p-4">
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <p className="typo-body-2-regular text-label-info mb-1">
            {formatDate(consultation.createdAt)}
          </p>
          <p className="typo-body-1-semibold text-label-strong truncate mb-2">
            {consultation.title}
          </p>
          <div className="flex items-center gap-3">
            <span className="typo-body-2-regular text-label-default">
              {formatAmount(consultation.maxAmount)}
            </span>
            <div className="flex items-center gap-1 text-label-info">
              <EyeIcon className="size-3.5 fill-label-info" />
              <span className="typo-body-2-regular">{consultation.viewCount}</span>
            </div>
            <div className="flex items-center gap-1 text-label-info">
              <CommentIcon className="size-3.5 fill-label-info" />
              <span className="typo-body-2-regular">{consultation.commentCount}</span>
            </div>
          </div>
        </div>
        <span className="typo-body-2-semibold text-label-info shrink-0">
          {consultation.brandName}
        </span>
      </div>
    </div>
  );
}
