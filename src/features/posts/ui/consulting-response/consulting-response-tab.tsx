import { ToggleChip, ToggleChipGroup } from '@/shared';
import type { Option } from '@/shared/type/option';
import type { ValueOf } from '@/shared/type/types';

export const CONSULTING_RESPONSE_TAB = {
  CURRENT_STATE: 'currentState',
  RECOMMEND_STYLE: 'recommendStyle',
  PRICE_AND_COMMENT: 'priceAndComment',
} as const;

const CONSULTING_RESPONSE_TAB_OPTION: Record<
  ValueOf<typeof CONSULTING_RESPONSE_TAB>,
  Option<ValueOf<typeof CONSULTING_RESPONSE_TAB>>
> = {
  [CONSULTING_RESPONSE_TAB.CURRENT_STATE]: {
    value: CONSULTING_RESPONSE_TAB.CURRENT_STATE,
    label: '현재 상태',
  },
  [CONSULTING_RESPONSE_TAB.RECOMMEND_STYLE]: {
    value: CONSULTING_RESPONSE_TAB.RECOMMEND_STYLE,
    label: '추천 스타일',
  },
  [CONSULTING_RESPONSE_TAB.PRICE_AND_COMMENT]: {
    value: CONSULTING_RESPONSE_TAB.PRICE_AND_COMMENT,
    label: '견적 및 코멘트',
  },
} as const;

export const CONSULTING_RESPONSE_TAB_OPTIONS = Object.values(CONSULTING_RESPONSE_TAB_OPTION);

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
