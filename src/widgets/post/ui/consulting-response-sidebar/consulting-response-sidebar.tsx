import CloseIcon from '@/assets/icons/close.svg';
import { MULTI_STEP_FORM_PORTAL_ID } from '@/shared/ui/multi-step-form';
import { createPortal } from 'react-dom';

import { cn } from '@/lib/utils';
import { ToggleChip, ToggleChipGroup } from '@/shared';
import type { ValueOf } from '@/shared/type/types';
import {
  CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE,
  CONSULTING_RESPONSE_SIDEBAR_TABS,
} from '@/widgets/post/constants/consulting-response-sidebar-tab';
import { useRef, useState } from 'react';
import ConsultingResponseSidebarAdditionalInfoTabView from './consulting-response-sidebar-additional-info-tab-view';
import ConsultingResponseSidebarCurrentStateTabView from './consulting-response-sidebar-current-state-tab-view';
import ConsultingResponseSidebarDesiredStyleTabView from './consulting-response-sidebar-desired-style-tab-view';

type ConsultingResponseSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConsultingResponseSidebar({
  isOpen,
  onClose,
}: ConsultingResponseSidebarProps) {
  const [activeTab, setActiveTab] = useState(CONSULTING_RESPONSE_SIDEBAR_TABS[0].value);
  const [hasScroll, setHasScroll] = useState(false);
  const contentRef = useRef<HTMLDivElement>(null);

  const handleTabChange = (tab: ValueOf<typeof CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE>) => {
    setActiveTab(tab);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    setHasScroll(e.currentTarget.scrollTop > 0);
  };

  const images = [
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
    'https://meemong-job-storage.s3.ap-northeast-2.amazonaws.com/uploads/hair-consult-postings/images/2025/07/22/images/7b759976-7139-4f69-8e74-c8e6a4137d7c/7b759976-7139-4f69-8e74-c8e6a4137d7c.png',
  ];

  const description =
    '출근 전 미팅하는데 구레나룻이 너무 신경쓰여서요... \n솔직히 블루클럽 가도 되긴하는데 이왕 자르는거 좀 예쁘게도 자르고 싶기도 하구요... 잘하는데 좀 있나요? 출근 전 미팅하는데 구레나룻이 너무 신경쓰여서요...';

  const renderTabView = () => {
    switch (activeTab) {
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.CURRENT_STATE:
        return <ConsultingResponseSidebarCurrentStateTabView images={images} />;
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.DESIRED_STYLE:
        return (
          <ConsultingResponseSidebarDesiredStyleTabView images={images} description={description} />
        );
      case CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ADDITIONAL_INFO:
        return <ConsultingResponseSidebarAdditionalInfoTabView />;
    }
  };

  return createPortal(
    <div className={`absolute inset-0 z-50 ${!isOpen ? 'pointer-events-none' : ''}`}>
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
            <CloseIcon />
          </button>
          <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide px-5">
            {CONSULTING_RESPONSE_SIDEBAR_TABS.map(({ value, icon, label }) => (
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
