import { MULTI_STEP_FORM_PORTAL_ID } from '@/shared/ui/multi-step-form';
import { createPortal } from 'react-dom';
import CloseIcon from '@/assets/icons/close.svg';

import { ToggleChip, ToggleChipGroup } from '@/shared';
import { useState, useRef, useEffect } from 'react';
import type { ValueOf } from '@/shared/type/types';
import {
  CONSULTING_RESPONSE_SIDEBAR_TAB,
  CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE,
  CONSULTING_RESPONSE_SIDEBAR_TABS,
} from '@/widgets/post/constants/consulting-response-sidebar-tab';
import { cn } from '@/lib/utils';

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
          {CONSULTING_RESPONSE_SIDEBAR_TAB[activeTab].component}
        </div>
      </div>
    </div>,
    document.getElementById(MULTI_STEP_FORM_PORTAL_ID) || document.body,
  );
}
