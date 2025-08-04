import { MULTI_STEP_FORM_PORTAL_ID } from '@/shared/ui/multi-step-form';
import { createPortal } from 'react-dom';
import CloseIcon from '@/assets/icons/close.svg';
import GalleryIcon from '@/assets/icons/gallery.svg';
import StarIcon from '@/assets/icons/star.svg';
import ArticleIcon from '@/assets/icons/article.svg';
import { ToggleChip, ToggleChipGroup } from '@/shared';
import { useState } from 'react';
import type { ValueOf } from '@/shared/type/types';

const CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE = {
  CURRENT_STATE: 'currentState',
  DESIRED_STYLE: 'desiredStyle',
  ADDITIONAL_INFO: 'additionalInfo',
} as const;

const CONSULTING_RESPONSE_SIDEBAR_TAB = {
  [CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.CURRENT_STATE]: {
    label: '현재 상태',
    value: CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.CURRENT_STATE,
    icon: <GalleryIcon className="size-4 fill-label-info group-data-[state=on]:fill-white" />,
  },
  [CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.DESIRED_STYLE]: {
    label: '추구미',
    value: CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.DESIRED_STYLE,
    icon: <StarIcon className="size-4 fill-label-info group-data-[state=on]:fill-white" />,
  },
  [CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ADDITIONAL_INFO]: {
    label: '추가 정보',
    value: CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ADDITIONAL_INFO,
    icon: <ArticleIcon className="size-4 fill-label-info group-data-[state=on]:fill-white" />,
  },
} as const;

const CONSULTING_RESPONSE_SIDEBAR_TABS = Object.values(CONSULTING_RESPONSE_SIDEBAR_TAB);

type ConsultingResponseSidebarProps = {
  isOpen: boolean;
  onClose: () => void;
};

export default function ConsultingResponseSidebar({
  isOpen,
  onClose,
}: ConsultingResponseSidebarProps) {
  const [activeTab, setActiveTab] = useState(CONSULTING_RESPONSE_SIDEBAR_TABS[0].value);

  const handleTabChange = (tab: ValueOf<typeof CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE>) => {
    setActiveTab(tab);
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
          absolute right-0 top-0 h-full w-72
          bg-white transform transition-all duration-500 ease-in-out
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}
      >
        <div className="flex flex-col gap-3 py-5">
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
      </div>
    </div>,
    document.getElementById(MULTI_STEP_FORM_PORTAL_ID) || document.body,
  );
}
