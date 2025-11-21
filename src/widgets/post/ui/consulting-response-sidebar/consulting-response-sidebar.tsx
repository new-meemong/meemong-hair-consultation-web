import { useRef, useState } from 'react';

import CloseIcon from '@/assets/icons/close.svg';

import type { PostDetail } from '@/entities/posts/model/post-detail';

import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import {
  HAIR_CONCERN_OPTION_LABEL,
  HAIR_CONCERN_OPTION_VALUE,
} from '@/features/posts/constants/hair-concern-option';
import getSkinToneValue from '@/features/posts/lib/get-skin-tone-value';
import ConsultingResponseSidebarButton from '@/features/posts/ui/consulting-form/consulting-response-form/consulting-response-sidebar/consulting-response-sidebar-button';

import { cn } from '@/lib/utils';

import { USER_GUIDE_KEYS } from '@/shared/constants/local-storage';
import useShowGuide from '@/shared/hooks/use-show-guide';
import type { ValueOf } from '@/shared/type/types';
import { DrawerClose, DrawerContent, DrawerTitle, DrawerTrigger } from '@/shared/ui/drawer';

import {
  CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE,
  CONSULTING_RESPONSE_SIDEBAR_TABS,
} from '@/widgets/post/constants/consulting-response-sidebar-tab';

import { Drawer, ToggleChip, ToggleChipGroup } from '@/shared';

import ConsultingResponseSidebarGuideTooltip from '../consulting-response/consulting-response-sidebar-guide-tooltip';

import ConsultingResponseSidebarAdditionalInfoTabView from './consulting-response-sidebar-additional-info-tab-view';
import ConsultingResponseSidebarCurrentStateTabView from './consulting-response-sidebar-current-state-tab-view';
import ConsultingResponseSidebarDesiredStyleTabView from './consulting-response-sidebar-desired-style-tab-view';

const getSidebarTab = (post?: PostDetail) => {
  if (!post) return [];

  return CONSULTING_RESPONSE_SIDEBAR_TABS.filter((tab) => {
    if (tab.value === CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.CURRENT_STATE) {
      return post.myImageList;
    }
    if (tab.value === CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.DESIRED_STYLE) {
      return post.aspirations;
    }
    if (tab.value === CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ADDITIONAL_INFO) {
      return (
        post.hairConcern ||
        (post.treatments && post.treatments.length > 0) ||
        post.skinTone ||
        post.content
      );
    }
    return false;
  });
};

type ConsultingResponseSidebarProps = {
  postId: string;
  isOpen: boolean;
  onOpenChange?: (open: boolean) => void;
};

export default function ConsultingResponseSidebar({
  postId,
  isOpen,
  onOpenChange,
}: ConsultingResponseSidebarProps) {
  const { data: postDetail } = useGetPostDetail(postId);

  const consultingPost = postDetail?.data;

  const sidebarTabs = getSidebarTab(consultingPost);

  const [activeTab, setActiveTab] = useState(sidebarTabs[0].value);
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
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.CURRENT_STATE:
        return myImages ? <ConsultingResponseSidebarCurrentStateTabView images={myImages} /> : null;
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.DESIRED_STYLE:
        return aspirationImageUrls || aspirationImagesDescription ? (
          <ConsultingResponseSidebarDesiredStyleTabView
            images={aspirationImageUrls}
            description={aspirationImagesDescription}
          />
        ) : null;
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ADDITIONAL_INFO:
        return (
          <ConsultingResponseSidebarAdditionalInfoTabView
            hairConcern={hairConcern}
            skinToneValue={skinToneValue}
            treatments={consultingPost.treatments ?? []}
            minPaymentPrice={consultingPost.minPaymentPrice}
            maxPaymentPrice={consultingPost.maxPaymentPrice}
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
    <Drawer direction="right" open={isOpen} onOpenChange={handleOpenChange}>
      <DrawerTitle />
      <DrawerTrigger asChild>
        <div className="absolute bottom-26 right-5">
          <div className="flex flex-col items-end gap-4.25">
            {shouldShowGuide && <ConsultingResponseSidebarGuideTooltip />}
            <ConsultingResponseSidebarButton />
          </div>
        </div>
      </DrawerTrigger>
      <DrawerContent className={cn('h-full w-72 flex flex-col bg-white ')}>
        <div className={cn('flex flex-col gap-3 py-5', hasScroll && 'shadow-emphasize')}>
          <DrawerClose asChild key="close">
            <button type="button" className="self-end pr-5">
              <CloseIcon className="size-7 fill-label-info" />
            </button>
          </DrawerClose>
          <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide px-5">
            {sidebarTabs.map(({ value, icon, label }) => (
              <ToggleChip
                key={value}
                icon={icon}
                pressed={activeTab === value}
                onPressedChange={() => handleTabChange(value)}
              >
                {label}
              </ToggleChip>
            ))}
          </ToggleChipGroup>
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
