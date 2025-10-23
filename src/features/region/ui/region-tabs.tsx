import { cn, Separator } from '@/shared';

import { REGION_KEYS } from '../constants/region';
import type { SelectedRegion } from '../types/selected-region';

function Tab({
  label,
  value,
  onChange,
  selected,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  selected: boolean;
}) {
  return (
    <button
      className={cn(
        'w-full px-5 py-4 text-label-default',
        selected ? 'typo-body-1-semibold bg-alternative' : 'typo-body-1-regular bg-white',
      )}
      onClick={() => onChange(value)}
    >
      {label}
    </button>
  );
}

type RegionTabsProps = {
  regionOptions: string[];
  selectedRegion: SelectedRegion | null;
  onSelectKey: (key: string) => void;
  onSelectValue: (value: string) => void;
};

export default function RegionTabs({
  regionOptions,
  selectedRegion,
  onSelectKey,
  onSelectValue,
}: RegionTabsProps) {
  return (
    <div className="h-full">
      <div className="flex h-full">
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {REGION_KEYS.map((region) => (
            <Tab
              key={region}
              label={region}
              value={region}
              onChange={onSelectKey}
              selected={selectedRegion?.key === region}
            />
          ))}
        </div>
        <Separator orientation="vertical" />
        <div className="flex-1 overflow-y-auto scrollbar-hide">
          {regionOptions.map((value) => (
            <Tab
              key={value}
              label={value}
              value={value}
              onChange={onSelectValue}
              selected={selectedRegion?.values.includes(value) ?? false}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
