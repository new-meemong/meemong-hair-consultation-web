import { ToggleChip, ToggleChipGroup } from '@/shared';
import type { ValueOf } from '@/shared/type/types';

import {
  CONSULTING_RESPONSE_TAB,
  CONSULTING_RESPONSE_TAB_OPTIONS,
} from '../../constants/consulting-response-tab';

type ConsultingResponseTabProps = {
  activeTab: ValueOf<typeof CONSULTING_RESPONSE_TAB>;
  handleTabChange: (tab: ValueOf<typeof CONSULTING_RESPONSE_TAB>) => void;
};

export default function ConsultingResponseTab({
  activeTab,
  handleTabChange,
}: ConsultingResponseTabProps) {
  return (
    <ToggleChipGroup className="flex overflow-x-auto scrollbar-hide gap-2">
      {CONSULTING_RESPONSE_TAB_OPTIONS.map(({ value, label }) => (
        <ToggleChip
          key={value}
          pressed={activeTab === value}
          onPressedChange={() => handleTabChange(value)}
        >
          {label}
        </ToggleChip>
      ))}
    </ToggleChipGroup>
  );
}
