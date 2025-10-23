'use client';

import { useState } from 'react';

import { REGIONS } from '@/features/region/constants/region';
import type { SelectedRegion } from '@/features/region/types/selected-region';
import RegionTabs from '@/features/region/ui/region-tabs';
import SelectedRegionItem from '@/features/region/ui/selected-region-item';
import { Button, Separator } from '@/shared';
import type { KeyOf } from '@/shared/type/types';
import { SiteHeader } from '@/widgets/header';

const MAX_SELECTED_VALUES = 3;

export default function SelectRegionPage() {
  const [selectedRegion, setSelectedRegion] = useState<SelectedRegion | null>(null);

  const handleSelectKey = (key: string) => {
    setSelectedRegion({ key, values: [] });
  };

  const allOption = `${selectedRegion?.key} 전체`;

  const options = selectedRegion
    ? [allOption, ...(selectedRegion ? REGIONS[selectedRegion.key as KeyOf<typeof REGIONS>] : [])]
    : [];

  const handleSelectValue = (value: string) => {
    setSelectedRegion((prev) => {
      if (!prev) return prev;

      const selectedAllOption = prev.values.includes(allOption);

      if (value === allOption) {
        return { ...prev, values: selectedAllOption ? [] : [allOption] };
      }

      if (prev.values.includes(value)) {
        return { ...prev, values: prev.values.filter((v) => v !== value && v !== allOption) };
      }

      if (prev.values.length >= MAX_SELECTED_VALUES) return prev;

      return { ...prev, values: [...prev.values.filter((v) => v !== allOption), value] };
    });
  };

  const handleDeleteValue = (value: string) => {
    setSelectedRegion((prev) => {
      if (!prev) return prev;

      return { ...prev, values: prev.values.filter((v) => v !== value) };
    });
  };

  console.log('selectedRegion', selectedRegion);

  const handleSubmit = () => {
    console.log(selectedRegion);
  };

  return (
    <div className="min-w-[375px] w-full mx-auto flex flex-col h-screen">
      <SiteHeader title="게시글 지역" showBackButton />
      <div className="flex flex-col px-5 py-10 gap-2">
        <p className="typo-title-3-semibold text-label-default">검색할 지역을 선택해주세요</p>
        <p className="typo-body-1-regular text-label-sub">
          도 단위 1개 혹은 구 단위 3개까지 선택할 수 있습니다.
        </p>
      </div>
      <Separator />
      <div className="overflow-y-auto scrollbar-hide">
        <RegionTabs
          regionOptions={options}
          selectedRegion={selectedRegion}
          onSelectKey={handleSelectKey}
          onSelectValue={handleSelectValue}
        />
      </div>
      {selectedRegion && selectedRegion.values.length > 0 && (
        <div className="px-5 py-3 flex flex-col gap-2 bg-alternative bottom-0 left-0 right-0">
          {selectedRegion.values.map((value) => (
            <SelectedRegionItem
              key={value}
              value={value}
              regionKey={selectedRegion.key}
              onDelete={handleDeleteValue}
            />
          ))}
        </div>
      )}
      <div className="px-5 pt-3 pb-6">
        <Button size="lg" className="rounded-4 w-full" onClick={handleSubmit}>
          확인
        </Button>
      </div>
    </div>
  );
}
