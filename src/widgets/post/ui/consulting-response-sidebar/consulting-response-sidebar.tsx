import { useRef, useState } from 'react';

import { createPortal } from 'react-dom';

import CloseIcon from '@/assets/icons/close.svg';
import type { PostDetail } from '@/entities/posts/model/post-detail';
import useGetPostDetail from '@/features/posts/api/use-get-post-detail';
import {
  HAIR_CONCERN_OPTION_LABEL,
  HAIR_CONCERN_OPTION_VALUE,
} from '@/features/posts/constants/hair-concern-option';
import getSkinToneValue from '@/features/posts/lib/get-skin-tone-value';
import { cn } from '@/lib/utils';
import { ToggleChip, ToggleChipGroup } from '@/shared';
import type { ValueOf } from '@/shared/type/types';
import { MULTI_STEP_FORM_PORTAL_ID } from '@/shared/ui/multi-step-form';
import {
  CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE,
  CONSULTING_RESPONSE_SIDEBAR_TABS,
} from '@/widgets/post/constants/consulting-response-sidebar-tab';

import ConsultingResponseSidebarAdditionalInfoTabView from './consulting-response-sidebar-additional-info-tab-view';
import ConsultingResponseSidebarCurrentStateTabView from './consulting-response-sidebar-current-state-tab-view';
import ConsultingResponseSidebarDesiredStyleTabView from './consulting-response-sidebar-desired-style-tab-view';

const getSidebarTab = (post?: PostDetail) => {
  if (!post) return [];

  return CONSULTING_RESPONSE_SIDEBAR_TABS.filter((tab) => {
    if (tab.value === CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.CURRENT_STATE) {
      return post.myImages;
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
  isOpen: boolean;
  onClose: () => void;
  postId: string;
};

export default function ConsultingResponseSidebar({
  isOpen,
  onClose,
  postId,
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

  if (!consultingPost) return null;

  const myImages = consultingPost.myImages
    ? [
        consultingPost.myImages.frontLooseImageUrl,
        consultingPost.myImages.frontTiedImageUrl,
        consultingPost.myImages.sideTiedImageUrl,
        consultingPost.myImages.upperBodyImageUrl,
      ]
    : null;

  const aspirationImageUrls = consultingPost.aspirations?.aspirationImages ?? [];
  const aspirationImagesDescription = consultingPost.aspirations?.description ?? null;

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
          />
        );
    }
  };

  return createPortal(
    <div className={`fixed inset-0 z-50 ${!isOpen ? 'pointer-events-none' : ''}`}>
      <div
        className={`absolute inset-0 bg-dimmer transition-opacity duration-500 ${
          isOpen ? 'opacity-100' : 'opacity-0'
        }`}
      />
      <div
        className={`
          absolute right-0 top-0 h-full w-72 flex flex-col
          bg-white transform transition-all duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className={cn('flex flex-col gap-3 py-5', hasScroll && 'shadow-emphasize')}>
          <button type="button" className="self-end pr-5" onClick={onClose}>
            <CloseIcon className="size-7 fill-label-info" />
          </button>
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
      </div>
    </div>,
    document.getElementById(MULTI_STEP_FORM_PORTAL_ID) || document.body,
  );
}
