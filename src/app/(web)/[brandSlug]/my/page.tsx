'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import ChevronRightIcon from '@/assets/icons/chevron-right.svg';
import ShareIcon from '@/assets/icons/share.svg';
import EyeIcon from '@/assets/icons/eye.svg';
import CommentIcon from '@/assets/icons/comment.svg';
import Checkbox from '@/shared/ui/checkbox';
import { GenderSelector, type Gender } from '@/features/profile/ui/gender-selector';
import { RegionAddressInput } from '@/features/region/ui/region-address-input';
import { useBrand } from '@/shared/context/brand-context';
import { ROUTES } from '@/shared/lib/routes';
import { createWebApiClient } from '@/shared/lib/web-api';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Button } from '@/shared/ui/button';
import { DrawerClose, DrawerFooter, DrawerHeader, DrawerTitle } from '@/shared/ui/drawer';
import { Loader } from '@/shared/ui/loader';
import type {
  HairConsultationConcern,
  HairConsultationHairLength,
  HairConsultationHairTexture,
  HairConsultationSkinBrightness,
  HairConsultationPersonalColor,
} from '@/entities/posts/api/create-hair-consultation-request';

const WEB_USER_KEY = (slug: string) => `web_user_data:${slug}`;

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

const HAIR_LENGTH_OPTIONS: HairConsultationHairLength[] = [
  '크롭',
  '숏',
  '미디엄',
  '미디엄롱',
  '롱',
  '장발',
  '숏컷',
  '단발',
  '중단발',
];
const HAIR_CONCERN_OPTIONS: HairConsultationConcern[] = [
  '어울리는 스타일',
  '어울리는 컬러',
  '탈모',
  '적은 숱',
  '얇은 모발',
  '볼륨 부족',
  '스타일링 어려움',
  '펌이 금방풀림',
  '심한 곱슬',
  '심한 직모',
  '모발손상',
  '지성두피',
  '건조한 두피',
  '특별한 문제는 없어요',
];
const HAIR_TEXTURE_OPTIONS: HairConsultationHairTexture[] = [
  '강한 직모',
  '직모',
  '반곱슬',
  '곱슬',
  '강한 곱슬',
];
const SKIN_BRIGHTNESS_OPTIONS: HairConsultationSkinBrightness[] = [
  '매우 밝은/하얀 피부',
  '밝은 피부',
  '보통 피부',
  '까만 피부',
  '매우 어두운/까만 피부',
  '18호 이하',
  '19~21호',
  '22~23호',
  '24~25호',
  '26호 이상',
];
const PERSONAL_COLOR_OPTIONS: HairConsultationPersonalColor[] = [
  '잘모름',
  '봄웜,봄라이트',
  '봄웜,봄브라이트',
  '봄웜,상세분류모름',
  '여름쿨,여름라이트',
  '여름쿨,여름뮤트',
  '여름쿨,상세분류모름',
  '가을웜,가을뮤트',
  '가을웜,가을딥',
  '가을웜,상세분류모름',
  '겨울쿨,겨울브라이트',
  '겨울쿨,겨울딥',
  '겨울쿨,상세분류모름',
];

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

  // 머리기장 수정
  const [hairLengthEditOpen, setHairLengthEditOpen] = useState(false);
  const [editHairLength, setEditHairLength] = useState<HairConsultationHairLength | null>(null);
  const [isSavingHairLength, setIsSavingHairLength] = useState(false);

  // 헤어고민 수정
  const [hairConcernEditOpen, setHairConcernEditOpen] = useState(false);
  const [editHairConcerns, setEditHairConcerns] = useState<HairConsultationConcern[]>([]);
  const [isSavingHairConcern, setIsSavingHairConcern] = useState(false);

  // 모발타입 수정
  const [hairTextureEditOpen, setHairTextureEditOpen] = useState(false);
  const [editHairTexture, setEditHairTexture] = useState<HairConsultationHairTexture | null>(null);
  const [isSavingHairTexture, setIsSavingHairTexture] = useState(false);

  // 피부톤 수정
  const [skinBrightnessEditOpen, setSkinBrightnessEditOpen] = useState(false);
  const [editSkinBrightness, setEditSkinBrightness] =
    useState<HairConsultationSkinBrightness | null>(null);
  const [isSavingSkinBrightness, setIsSavingSkinBrightness] = useState(false);

  // 퍼스널컬러 수정
  const [personalColorEditOpen, setPersonalColorEditOpen] = useState(false);
  const [editPersonalColor, setEditPersonalColor] = useState<HairConsultationPersonalColor | null>(
    null,
  );
  const [isSavingPersonalColor, setIsSavingPersonalColor] = useState(false);

  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem(WEB_USER_KEY(brand.slug)) ?? '{}');
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
          WEB_USER_KEY(brand.slug),
          JSON.stringify({ ...userData, modelInfoId }),
        );
      }
      return api.get<ModelData>(`models/${modelInfoId}/my-page`);
    };

    fetchProfile()
      .then((data) => setModel(data))
      .catch(() => {})
      .finally(() => setIsLoading(false));
  }, [brand.slug, router]);

  const getApi = () => {
    const userData = JSON.parse(localStorage.getItem(WEB_USER_KEY(brand.slug)) ?? '{}');
    return createWebApiClient(userData.token);
  };

  const handleShare = async () => {
    const url = `${window.location.origin}${ROUTES.WEB_WELCOME(brand.slug)}`;
    if (navigator.share) {
      await navigator.share({ url });
    } else {
      await navigator.clipboard.writeText(url);
    }
  };

  // 성별
  const handleOpenGenderEdit = () => {
    setEditGender(model?.sex === '여자' ? 'FEMALE' : model?.sex === '남자' ? 'MALE' : null);
    setGenderEditOpen(true);
  };
  const handleSaveGender = async () => {
    if (!editGender) return;
    setIsSavingGender(true);
    try {
      await getApi().patch('models/me', { sex: editGender === 'FEMALE' ? '여자' : '남자' });
      setModel((prev) =>
        prev ? { ...prev, sex: editGender === 'FEMALE' ? '여자' : '남자' } : prev,
      );
      setGenderEditOpen(false);
    } finally {
      setIsSavingGender(false);
    }
  };

  // 추천지역
  const editRegionDisplay =
    editRegionKey && editRegionValue ? `${editRegionKey} ${editRegionValue}` : null;
  const handleOpenRegionEdit = () => {
    if (model?.modelInfo?.address) {
      const parts = model.modelInfo.address.split(' ');
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
      const address = `${editRegionKey} ${editRegionValue}`;
      await getApi().patch('models/me', { address });
      setModel((prev) => (prev ? { ...prev, modelInfo: { ...prev.modelInfo, address } } : prev));
      setRegionEditOpen(false);
    } finally {
      setIsSavingRegion(false);
    }
  };

  // 머리기장
  const handleOpenHairLengthEdit = () => {
    setEditHairLength(model?.modelInfo?.hairLength ?? null);
    setHairLengthEditOpen(true);
  };
  const handleSaveHairLength = async () => {
    if (!editHairLength) return;
    setIsSavingHairLength(true);
    try {
      await getApi().patch('models/me', { hairLength: editHairLength });
      setModel((prev) =>
        prev ? { ...prev, modelInfo: { ...prev.modelInfo, hairLength: editHairLength } } : prev,
      );
      setHairLengthEditOpen(false);
    } finally {
      setIsSavingHairLength(false);
    }
  };

  // 헤어고민
  const handleOpenHairConcernEdit = () => {
    setEditHairConcerns(model?.modelInfo?.hairConcerns ?? []);
    setHairConcernEditOpen(true);
  };
  const toggleHairConcern = (concern: HairConsultationConcern) => {
    setEditHairConcerns((prev) =>
      prev.includes(concern) ? prev.filter((c) => c !== concern) : [...prev, concern],
    );
  };
  const handleSaveHairConcern = async () => {
    setIsSavingHairConcern(true);
    try {
      await getApi().patch('models/me', { hairConcerns: editHairConcerns });
      setModel((prev) =>
        prev ? { ...prev, modelInfo: { ...prev.modelInfo, hairConcerns: editHairConcerns } } : prev,
      );
      setHairConcernEditOpen(false);
    } finally {
      setIsSavingHairConcern(false);
    }
  };

  // 모발타입
  const handleOpenHairTextureEdit = () => {
    setEditHairTexture(model?.modelInfo?.hairTexture ?? null);
    setHairTextureEditOpen(true);
  };
  const handleSaveHairTexture = async () => {
    if (!editHairTexture) return;
    setIsSavingHairTexture(true);
    try {
      await getApi().patch('models/me', { hairTexture: editHairTexture });
      setModel((prev) =>
        prev ? { ...prev, modelInfo: { ...prev.modelInfo, hairTexture: editHairTexture } } : prev,
      );
      setHairTextureEditOpen(false);
    } finally {
      setIsSavingHairTexture(false);
    }
  };

  // 피부톤
  const handleOpenSkinBrightnessEdit = () => {
    setEditSkinBrightness(model?.modelInfo?.skinBrightness ?? null);
    setSkinBrightnessEditOpen(true);
  };
  const handleSaveSkinBrightness = async () => {
    if (!editSkinBrightness) return;
    setIsSavingSkinBrightness(true);
    try {
      await getApi().patch('models/me', { skinBrightness: editSkinBrightness });
      setModel((prev) =>
        prev
          ? { ...prev, modelInfo: { ...prev.modelInfo, skinBrightness: editSkinBrightness } }
          : prev,
      );
      setSkinBrightnessEditOpen(false);
    } finally {
      setIsSavingSkinBrightness(false);
    }
  };

  // 퍼스널컬러
  const handleOpenPersonalColorEdit = () => {
    setEditPersonalColor(model?.modelInfo?.personalColor ?? null);
    setPersonalColorEditOpen(true);
  };
  const handleSavePersonalColor = async () => {
    if (!editPersonalColor) return;
    setIsSavingPersonalColor(true);
    try {
      await getApi().patch('models/me', { personalColor: editPersonalColor });
      setModel((prev) =>
        prev
          ? { ...prev, modelInfo: { ...prev.modelInfo, personalColor: editPersonalColor } }
          : prev,
      );
      setPersonalColorEditOpen(false);
    } finally {
      setIsSavingPersonalColor(false);
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
                <InfoRow label="성별" value={model?.sex} onEdit={handleOpenGenderEdit} />
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
            onClick={() => router.push(ROUTES.WEB_AUTH_PHONE(brand.slug))}
          >
            새 컨설팅 시작하기
          </button>
        </div>
      </div>

      {/* 성별 수정 */}
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

      {/* 추천지역 수정 */}
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

      {/* 머리기장 수정 */}
      <BottomSheet
        id="hair-length-edit-sheet"
        open={hairLengthEditOpen}
        onClose={() => setHairLengthEditOpen(false)}
        hideHandle
        className="gap-4 pt-6"
      >
        <DrawerHeader>
          <DrawerTitle>머리기장 수정</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col overflow-y-auto max-h-[55vh]">
          {HAIR_LENGTH_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className="flex items-center justify-between px-1 py-4 border-b border-border-default text-left"
              onClick={() => setEditHairLength(opt)}
            >
              <span className="typo-body-1-regular text-label-default">{opt}</span>
              {editHairLength === opt && <ChevronRightIcon className="size-4 fill-label-default" />}
            </button>
          ))}
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
              disabled={!editHairLength || isSavingHairLength}
              onClick={handleSaveHairLength}
            >
              {isSavingHairLength && <Loader size="sm" theme="light" />}
              저장
            </Button>,
          ]}
        />
      </BottomSheet>

      {/* 헤어고민 수정 */}
      <BottomSheet
        id="hair-concern-edit-sheet"
        open={hairConcernEditOpen}
        onClose={() => setHairConcernEditOpen(false)}
        hideHandle
        className="gap-4 pt-6"
      >
        <DrawerHeader>
          <DrawerTitle>헤어고민 수정</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col overflow-y-auto max-h-[55vh]">
          {HAIR_CONCERN_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className="flex items-center gap-3 px-1 py-4 border-b border-border-default text-left"
              onClick={() => toggleHairConcern(opt)}
            >
              <Checkbox
                shape="square"
                id={`concern-${opt}`}
                checked={editHairConcerns.includes(opt)}
                onChange={() => toggleHairConcern(opt)}
                onClick={(e) => e.stopPropagation()}
              />
              <span className="typo-body-1-regular text-label-default">{opt}</span>
            </button>
          ))}
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
              disabled={isSavingHairConcern}
              onClick={handleSaveHairConcern}
            >
              {isSavingHairConcern && <Loader size="sm" theme="light" />}
              저장
            </Button>,
          ]}
        />
      </BottomSheet>

      {/* 모발타입 수정 */}
      <BottomSheet
        id="hair-texture-edit-sheet"
        open={hairTextureEditOpen}
        onClose={() => setHairTextureEditOpen(false)}
        hideHandle
        className="gap-4 pt-6"
      >
        <DrawerHeader>
          <DrawerTitle>모발타입 수정</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col overflow-y-auto max-h-[55vh]">
          {HAIR_TEXTURE_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className="flex items-center justify-between px-1 py-4 border-b border-border-default text-left"
              onClick={() => setEditHairTexture(opt)}
            >
              <span className="typo-body-1-regular text-label-default">{opt}</span>
              {editHairTexture === opt && (
                <ChevronRightIcon className="size-4 fill-label-default" />
              )}
            </button>
          ))}
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
              disabled={!editHairTexture || isSavingHairTexture}
              onClick={handleSaveHairTexture}
            >
              {isSavingHairTexture && <Loader size="sm" theme="light" />}
              저장
            </Button>,
          ]}
        />
      </BottomSheet>

      {/* 피부톤 수정 */}
      <BottomSheet
        id="skin-brightness-edit-sheet"
        open={skinBrightnessEditOpen}
        onClose={() => setSkinBrightnessEditOpen(false)}
        hideHandle
        className="gap-4 pt-6"
      >
        <DrawerHeader>
          <DrawerTitle>피부톤 수정</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col overflow-y-auto max-h-[55vh]">
          {SKIN_BRIGHTNESS_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className="flex items-center justify-between px-1 py-4 border-b border-border-default text-left"
              onClick={() => setEditSkinBrightness(opt)}
            >
              <span className="typo-body-1-regular text-label-default">{opt}</span>
              {editSkinBrightness === opt && (
                <ChevronRightIcon className="size-4 fill-label-default" />
              )}
            </button>
          ))}
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
              disabled={!editSkinBrightness || isSavingSkinBrightness}
              onClick={handleSaveSkinBrightness}
            >
              {isSavingSkinBrightness && <Loader size="sm" theme="light" />}
              저장
            </Button>,
          ]}
        />
      </BottomSheet>

      {/* 퍼스널컬러 수정 */}
      <BottomSheet
        id="personal-color-edit-sheet"
        open={personalColorEditOpen}
        onClose={() => setPersonalColorEditOpen(false)}
        hideHandle
        className="gap-4 pt-6"
      >
        <DrawerHeader>
          <DrawerTitle>퍼스널컬러 수정</DrawerTitle>
        </DrawerHeader>
        <div className="flex flex-col overflow-y-auto max-h-[55vh]">
          {PERSONAL_COLOR_OPTIONS.map((opt) => (
            <button
              key={opt}
              type="button"
              className="flex items-center justify-between px-1 py-4 border-b border-border-default text-left"
              onClick={() => setEditPersonalColor(opt)}
            >
              <span className="typo-body-1-regular text-label-default">{opt}</span>
              {editPersonalColor === opt && (
                <ChevronRightIcon className="size-4 fill-label-default" />
              )}
            </button>
          ))}
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
              disabled={!editPersonalColor || isSavingPersonalColor}
              onClick={handleSavePersonalColor}
            >
              {isSavingPersonalColor && <Loader size="sm" theme="light" />}
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
