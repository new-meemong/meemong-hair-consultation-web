import {
  CONSULTING_RESPONSE_SIDEBAR_TABS,
  CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE,
} from '@/widgets/post/constants/consulting-response-sidebar-tab';
import { Drawer } from '@/shared';
import { DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '@/shared/ui/drawer';
import {
  HAIR_CONCERN_OPTION_LABEL,
  HAIR_CONCERN_OPTION_VALUE,
} from '@/features/posts/constants/hair-concern-option';
import { useRef, useState } from 'react';

import CloseIcon from '@/assets/icons/close.svg';
import ConsultingResponseSidebarAdditionalInfoTabView from './consulting-response-sidebar-additional-info-tab-view';
import ConsultingResponseSidebarButton from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-sidebar/consulting-response-sidebar-button';
import ConsultingResponseSidebarCurrentStateTabView from './consulting-response-sidebar-current-state-tab-view';
import ConsultingResponseSidebarDesiredStyleTabView from './consulting-response-sidebar-desired-style-tab-view';
import ConsultingResponseSidebarGuideTooltip from '../consulting-response/consulting-response-sidebar-guide-tooltip';
import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import type { ValueOf } from '@/shared/type/types';
import { cn } from '@/lib/utils';
import getSkinToneValue from '@/features/posts/lib/get-skin-tone-value';
import { usePostDetail } from '@/features/posts/context/post-detail-context';
import useShowGuide from '@/shared/hooks/use-show-guide';

type ConsultingResponseSidebarProps = {
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
};

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

  const myImages = consultingPost.myImageList
    ? consultingPost.myImageList.map(({ imageUrl }) => imageUrl)
    : null;

  const aspirationImageUrls = consultingPost.aspirations?.aspirationImages ?? [];
  const aspirationImagesDescription = consultingPost.aspirations?.aspirationDescription ?? null;

  const hairConcern =
    consultingPost.hairConcern === HAIR_CONCERN_OPTION_LABEL[HAIR_CONCERN_OPTION_VALUE.ETC]
      ? (consultingPost.hairConcernDetail ?? '')
      : consultingPost.hairConcern;

  const skinToneValue = getSkinToneValue(consultingPost.skinTone);

  const renderTabView = () => {
    switch (activeTab) {
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.PHOTOS:
        return myImages ? <ConsultingResponseSidebarCurrentStateTabView images={myImages} /> : null;
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.TREATMENTS:
        return (
          <ConsultingResponseSidebarAdditionalInfoTabView
            hairConcern={hairConcern}
            skinToneValue={skinToneValue}
            treatments={consultingPost.treatments ?? []}
            minPaymentPrice={consultingPost.minPaymentPrice}
            maxPaymentPrice={consultingPost.maxPaymentPrice}
            showHairConcern={false}
            showTreatments={true}
            showSkinTone={false}
            showPaymentPrice={false}
          />
        );
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.PREFERRED_STYLE:
        return aspirationImageUrls || aspirationImagesDescription ? (
          <ConsultingResponseSidebarDesiredStyleTabView
            images={aspirationImageUrls}
            description={aspirationImagesDescription}
          />
        ) : null;
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ETC:
        return (
          <ConsultingResponseSidebarAdditionalInfoTabView
            hairConcern={hairConcern}
            skinToneValue={skinToneValue}
            treatments={consultingPost.treatments ?? []}
            minPaymentPrice={consultingPost.minPaymentPrice}
            maxPaymentPrice={consultingPost.maxPaymentPrice}
            showHairConcern={true}
            showTreatments={false}
            showSkinTone={true}
            showPaymentPrice={true}
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
               px-5 overflow-y-auto scrollbar-hide
             `}
          onScroll={handleScroll}
        >
          {renderTabView()}
        </div>
      </DrawerContent>
    </Drawer>
  );
}
