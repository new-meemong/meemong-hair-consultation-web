'use client';

import type {
  HairConsultationConcern,
  HairConsultationHairLength,
  HairConsultationHairTexture,
  HairConsultationPersonalColor,
  HairConsultationSkinBrightness,
} from '@/entities/posts/api/create-hair-consultation-request';
import {
  WEB_HAIR_CONSULTATION_CONTENT_KEY,
  WEB_USER_DATA_KEY,
} from '@/shared/constants/local-storage';
import { useEffect, useState } from 'react';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import { DEFAULT_HAIR_CONSULTATION_FORM_VALUES } from '@/features/posts/constants/hair-consultation-form-default-values';
import EyeIcon from '@/assets/icons/eye.svg';
import { Loader } from '@/shared/ui/loader';
import { ROUTES } from '@/shared/lib/routes';
import ShareIcon from '@/assets/icons/share.svg';
import { createWebApiClient } from '@/shared/lib/web-api';
import { useBrand } from '@/shared/context/brand-context';
import { useRouter } from 'next/navigation';

type ModelData = {
  displayName: string;
  phone?: string;
  sex?: '여자' | '남자';
  modelInfo: {
    address?: string;
    hairLength?: HairConsultationHairLength | null;
    hairConcerns?: HairConsultationConcern[] | null;
    hairTexture?: HairConsultationHairTexture | null;
    skinBrightness?: HairConsultationSkinBrightness | null;
    personalColor?: HairConsultationPersonalColor | null;
  };
};

type InProgressConsultation = {
  id: string;
  brandName: string;
  totalSteps: number;
  completedSteps: number;
  startedAt: string;
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

function formatPhone(phone: string): string {
  return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

export default function MyPage() {
  const router = useRouter();
  const { config: brand } = useBrand();

  const [model, setModel] = useState<ModelData | null>(null);
  const [inProgress, _setInProgress] = useState<InProgressConsultation | null>(null);
  const [sentConsultations, _setSentConsultations] = useState<SentConsultation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [infoExpanded, setInfoExpanded] = useState(true);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(WEB_USER_DATA_KEY(brand.slug)) ?? '{}');
    if (!userData.userId || !userData.token) {
      router.replace(ROUTES.WEB_AUTH_PHONE(brand.slug));
      return;
    }

    const api = createWebApiClient(userData.token);

    const fetchProfile = async () => {
      let { modelInfoId } = userData;
      if (!modelInfoId) {
        const me = await api.get<{ id: number }>('models/me');
        modelInfoId = me.id;
        localStorage.setItem(
          WEB_USER_DATA_KEY(brand.slug),
          JSON.stringify({ ...userData, modelInfoId }),
        );
      }
      return api.get<ModelData>(`models/${modelInfoId}/my-page`);
    };

    fetchProfile()
      .then((data) => setModel(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [brand.slug]);

  const handleShare = async () => {
    const url = `${window.location.origin}${ROUTES.WEB_WELCOME(brand.slug)}`;
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  const writeModelInfoToStorage = () => {
    const content = {
      hairLength: model?.modelInfo?.hairLength ?? null,
      hairConcerns: model?.modelInfo?.hairConcerns ?? [],
      hairTexture: model?.modelInfo?.hairTexture ?? null,
      skinBrightness: model?.modelInfo?.skinBrightness ?? null,
      personalColor: model?.modelInfo?.personalColor ?? null,
    };
    localStorage.setItem(WEB_HAIR_CONSULTATION_CONTENT_KEY, JSON.stringify({ step: 1, content }));
  };

  const handleOpenRegionEdit = () => {
    const params = new URLSearchParams({ editMode: 'true' });
    if (model?.modelInfo?.address) {
      const parts = model.modelInfo.address.split(' ');
      if (parts[0]) params.set('regionKey', parts[0]);
      if (parts[1]) params.set('regionValue', parts[1]);
    }
    router.push(`${ROUTES.WEB_AUTH_SIGNUP_REGION(brand.slug)}?${params.toString()}`);
  };

  const handleOpenHairLengthEdit = () => {
    writeModelInfoToStorage();
    router.push(`${ROUTES.WEB_CONSULTATION_STEP(brand.slug, 'hairLength')}?editMode=true`);
  };

  const handleOpenHairConcernEdit = () => {
    writeModelInfoToStorage();
    router.push(`${ROUTES.WEB_CONSULTATION_STEP(brand.slug, 'hairConcerns')}?editMode=true`);
  };

  const handleOpenHairTextureEdit = () => {
    writeModelInfoToStorage();
    router.push(`${ROUTES.WEB_CONSULTATION_STEP(brand.slug, 'hairTexture')}?editMode=true`);
  };

  const handleOpenSkinBrightnessEdit = () => {
    writeModelInfoToStorage();
    router.push(`${ROUTES.WEB_CONSULTATION_STEP(brand.slug, 'skinBrightness')}?editMode=true`);
  };

  const handleOpenPersonalColorEdit = () => {
    writeModelInfoToStorage();
    router.push(`${ROUTES.WEB_CONSULTATION_STEP(brand.slug, 'personalColor')}?editMode=true`);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <Loader size="md" theme="dark" />
      </div>
    );
  }

  return (
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
        <section className="border-b border-border-default">
          <button
            type="button"
            className="w-full flex items-center justify-between px-5 py-6"
            onClick={() => setInfoExpanded((v) => !v)}
          >
            <span className="typo-body-2-semibold text-label-default">내 정보</span>
            <ChevronRightIcon
              className={`size-5 fill-label-default transition-transform duration-200 ${infoExpanded ? 'rotate-90' : '-rotate-90'}`}
            />
          </button>

          {infoExpanded && (
            <div className="flex flex-col px-5 pb-6">
              <InfoRow label="성별" value={model?.sex} readOnly />
              <InfoRow
                label="연락처"
                value={model?.phone ? formatPhone(model.phone) : undefined}
                readOnly
              />
              <InfoRow
                label="추천지역"
                value={model?.modelInfo?.address}
                onEdit={handleOpenRegionEdit}
              />
              <InfoRow
                label="머리기장"
                value={model?.modelInfo?.hairLength ?? undefined}
                onEdit={handleOpenHairLengthEdit}
              />
              <InfoRow
                label="헤어고민"
                value={model?.modelInfo?.hairConcerns?.join(', ')}
                onEdit={handleOpenHairConcernEdit}
              />
              <InfoRow
                label="모발타입"
                value={model?.modelInfo?.hairTexture ?? undefined}
                onEdit={handleOpenHairTextureEdit}
              />
              <InfoRow
                label="피부톤"
                value={model?.modelInfo?.skinBrightness ?? undefined}
                onEdit={handleOpenSkinBrightnessEdit}
              />
              <InfoRow
                label="퍼스널컬러"
                value={model?.modelInfo?.personalColor ?? undefined}
                onEdit={handleOpenPersonalColorEdit}
              />
            </div>
          )}
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
          onClick={() => {
            const content = {
              ...DEFAULT_HAIR_CONSULTATION_FORM_VALUES,
              hairLength:
                model?.modelInfo?.hairLength ?? DEFAULT_HAIR_CONSULTATION_FORM_VALUES.hairLength,
              hairConcerns:
                model?.modelInfo?.hairConcerns ??
                DEFAULT_HAIR_CONSULTATION_FORM_VALUES.hairConcerns,
              hairTexture:
                model?.modelInfo?.hairTexture ?? DEFAULT_HAIR_CONSULTATION_FORM_VALUES.hairTexture,
              skinBrightness:
                model?.modelInfo?.skinBrightness ??
                DEFAULT_HAIR_CONSULTATION_FORM_VALUES.skinBrightness,
              personalColor:
                model?.modelInfo?.personalColor ??
                DEFAULT_HAIR_CONSULTATION_FORM_VALUES.personalColor,
            };
            localStorage.setItem(
              WEB_HAIR_CONSULTATION_CONTENT_KEY,
              JSON.stringify({ step: 1, content }),
            );
            router.push(`${ROUTES.WEB_POSTS_CREATE(brand.slug)}?skipReload=1`);
          }}
        >
          새 컨설팅 시작하기
        </button>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
  onEdit,
  readOnly,
}: {
  label: string;
  value: string | undefined;
  onEdit?: () => void;
  readOnly?: boolean;
}) {
  if (readOnly) {
    return (
      <div className="flex items-center justify-between py-4 border-b border-border-default">
        <span className="typo-body-2-semibold text-label-default">{label}</span>
        <span className="typo-body-1-regular text-label-info">{value ?? '-'}</span>
      </div>
    );
  }

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
      <div className="mb-2">
        <div className="flex justify-between typo-body-2-regular text-label-info mb-1">
          <span>완료 {consultation.completedSteps}문항</span>
          <span>{remaining}문항 남았어요</span>
        </div>
        <div className="h-1.5 bg-alternative rounded-full overflow-hidden">
          <div
            className="h-full bg-label-default rounded-full"
            style={{ width: `${(consultation.completedSteps / consultation.totalSteps) * 100}%` }}
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
