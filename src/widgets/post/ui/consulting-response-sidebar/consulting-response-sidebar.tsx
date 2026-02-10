import {
  CONSULTING_RESPONSE_SIDEBAR_TABS,
  CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE,
} from '@/widgets/post/constants/consulting-response-sidebar-tab';
import { DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '@/shared/ui/drawer';
import {
  FEMALE_HAIR_LENGTH_OPTIONS,
  MALE_HAIR_LENGTH_OPTIONS,
} from '@/features/posts/constants/hair-length-options';
import { useRef, useState } from 'react';

import CloseIcon from '@/assets/icons/close.svg';
import ConsultingResponseSidebarButton from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-sidebar/consulting-response-sidebar-button';
import ConsultingResponseSidebarCurrentStateTabView from './consulting-response-sidebar-current-state-tab-view';
import ConsultingResponseSidebarDesiredStyleTabView from './consulting-response-sidebar-desired-style-tab-view';
import ConsultingResponseSidebarEtcTabView from './consulting-response-sidebar-etc-tab-view';
import ConsultingResponseSidebarGuideTooltip from '../consulting-response/consulting-response-sidebar-guide-tooltip';
import ConsultingResponseSidebarTreatmentsTabView from './consulting-response-sidebar-treatments-tab-view';
import { Drawer } from '@/shared';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import type { ValueOf } from '@/shared/type/types';
import { cn } from '@/lib/utils';
import { isUserMale } from '@/entities/user/lib/user-sex';
import { usePostDetail } from '@/features/posts/context/post-detail-context';
import useShowGuide from '@/shared/hooks/use-show-guide';

type ConsultingResponseSidebarProps = {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
};

const PERSONAL_COLOR_BASE_COLOR_MAP: Record<string, string> = {
  봄웜: '#FAC4A8',
  여름쿨: '#F1D0E3',
  가을웜: '#EBB295',
  겨울쿨: '#E6447A',
};

const formatPriceText = (minPrice: number | null, maxPrice: number | null) => {
  if (minPrice == null && maxPrice == null) return '-';
  if (minPrice != null && maxPrice != null && minPrice !== maxPrice) {
    return `${minPrice.toLocaleString()}원~${maxPrice.toLocaleString()}원`;
  }

  const basePrice = maxPrice ?? minPrice;
  return basePrice != null ? `${basePrice.toLocaleString()}원` : '-';
};

const formatDesiredDateText = (
  desiredDateType: string | null | undefined,
  desiredDate: string | null | undefined,
) => {
  if (desiredDateType === '원하는 날짜 있음') {
    return (desiredDate ?? '').trim() || desiredDateType;
  }
  return desiredDateType ?? '-';
};

const formatPersonalColorDetailLabel = (value: string) => value.replace(/^(봄|여름|가을|겨울)/, '');

export default function ConsultingResponseSidebar({
  isOpen,
  onOpenChange,
}: ConsultingResponseSidebarProps) {
  const { postDetail: consultingPost } = usePostDetail();

  const [activeTab, setActiveTab] = useState(
    CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.PHOTOS as ValueOf<
      typeof CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE
    >,
  );
  const [hasScroll, setHasScroll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: ValueOf<typeof CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE>) => {
    setActiveTab(tab);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setHasScroll(e.currentTarget.scrollTop > 0);
  };

  const { shouldShowGuide, closeGuide } = useShowGuide(
    USER_GUIDE_KEYS.hasSeenConsultingResponseSidebarGuide,
  );

  if (!consultingPost) return null;

  const referenceImageUrls = consultingPost.myImageList?.map(({ imageUrl }) => imageUrl) ?? [];
  const profileImageUrls = consultingPost.modelImageList ?? [];
  const aspirationImageUrls = consultingPost.aspirations?.aspirationImages ?? [];
  const aspirationImagesDescription = consultingPost.aspirations?.aspirationDescription ?? null;
  const hairConcernText = [consultingPost.hairConcern, consultingPost.hairConcernDetail]
    .filter((value): value is string => !!value && value.trim().length > 0)
    .join(', ');
  const preferredCostText = formatPriceText(
    consultingPost.minPaymentPrice,
    consultingPost.maxPaymentPrice,
  );
  const desiredDateText = formatDesiredDateText(
    consultingPost.desiredDateType,
    consultingPost.desiredDate,
  );
  const hairLengthOptions = isUserMale(consultingPost.hairConsultPostingCreateUserSex)
    ? MALE_HAIR_LENGTH_OPTIONS
    : FEMALE_HAIR_LENGTH_OPTIONS;
  const hairLengthDescription =
    hairLengthOptions.find((option) => option.value === consultingPost.hairLength)?.description ??
    '';
  const personalColorChip = (() => {
    if (!consultingPost.personalColor || consultingPost.personalColor === '잘모름') return null;

    const [tone = '', detail = ''] = consultingPost.personalColor
      .split(',')
      .map((value) => value.trim());
    if (!tone) return null;

    const isUnknownDetail = !detail || detail === '상세분류모름';
    const normalizedDetail = formatPersonalColorDetailLabel(detail);

    return {
      text: isUnknownDetail ? tone : `${tone} ${normalizedDetail}`,
      backgroundColor: PERSONAL_COLOR_BASE_COLOR_MAP[tone],
    };
  })();

  const renderTabView = () => {
    switch (activeTab) {
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.PHOTOS:
        return (
          <ConsultingResponseSidebarCurrentStateTabView
            referenceImages={referenceImageUrls}
            profileImages={profileImageUrls}
          />
        );
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.TREATMENTS:
        return (
          <ConsultingResponseSidebarTreatmentsTabView
            treatments={consultingPost.treatments ?? []}
          />
        );
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.PREFERRED_STYLE:
        return (
          <ConsultingResponseSidebarDesiredStyleTabView
            images={aspirationImageUrls}
            description={aspirationImagesDescription}
          />
        );
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ETC:
        return (
          <ConsultingResponseSidebarEtcTabView
            title={consultingPost.title}
            content={consultingPost.content}
            preferredCostText={preferredCostText}
            desiredDateText={desiredDateText}
            hairConcernText={hairConcernText}
            hairTexture={consultingPost.hairTexture}
            skinBrightness={consultingPost.skinBrightness}
            personalColorChip={personalColorChip}
            hairLength={consultingPost.hairLength}
            hairLengthDescription={hairLengthDescription}
          />
        );
    }
  };

  const handleOpenChange = (open: boolean) => {
    if (shouldShowGuide) {
      closeGuide();
    }
    onOpenChange?.(open);
  };

  return (
    <Drawer direction="bottom" open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTitle />
      <DrawerTrigger asChild>
        <div className="absolute bottom-26 right-5">
          <div className="flex flex-col items-end gap-4.25">
            {shouldShowGuide && <ConsultingResponseSidebarGuideTooltip />}
            <ConsultingResponseSidebarButton />
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent
        className={cn(
          'w-full h-[80vh] max-w-screen-sm mx-auto flex flex-col bg-white border-none rounded-t-12',
        )}
      >
        <div className={cn('flex flex-col gap-3 py-5', hasScroll && 'shadow-emphasize')}>
          <div className="px-5 flex items-center justify-between">
            <p className="typo-title-3-semibold text-label-default">상담지 보기</p>
            <DrawerClose asChild key="close">
              <button type="button">
                <CloseIcon className="size-7 fill-label-info" />
              </button>
            </DrawerClose>
          </div>
          <div className="px-5">
            <div className="grid grid-cols-4 rounded-6 bg-alternative p-1">
              {CONSULTING_RESPONSE_SIDEBAR_TABS.map(({ value, label }) => (
                <button
                  key={value}
                  type="button"
                  className={cn(
                    'h-9 rounded-6 typo-body-2-medium',
                    activeTab === value
                      ? 'bg-white text-label-default shadow-[2px_2px_20px_0_rgba(0,0,0,0.06),2px_2px_10px_0_rgba(0,0,0,0.04)]'
                      : 'bg-transparent text-label-sub',
                  )}
                  onClick={() => handleTabChange(value)}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>
        </div>
        <div
          ref={contentRef}
          className={`
               px-5 pt-8 pb-8 overflow-y-auto scrollbar-hide
             `}
          onScroll={handleScroll}
        >
          {renderTabView()}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
