'use client';

import { useMemo, useState } from 'react';

import { cn } from '@/shared/lib/utils';
import { BottomSheet } from '@/shared/ui/bottom-sheet';
import { Input } from '@/shared/ui/input';

import { REGIONS } from '../constants/region';

type RegionItem = { key: string; value: string; label: string };

const ALL_REGIONS: RegionItem[] = Object.entries(REGIONS).flatMap(([key, values]) =>
  (values as readonly string[]).map((value) => ({ key, value, label: `${key} ${value}` })),
);

type RegionAddressInputProps = {
  value: string | null;
  searchOpen: boolean;
  onSearchOpenChange: (open: boolean) => void;
  onChange: (key: string, value: string) => void;
};

export function RegionAddressInput({
  value,
  searchOpen,
  onSearchOpenChange,
  onChange,
}: RegionAddressInputProps) {
  const [query, setQuery] = useState('');

  const filtered = useMemo(() => {
    if (!query.trim()) return ALL_REGIONS;
    return ALL_REGIONS.filter((r) => r.label.includes(query));
  }, [query]);

  const handleSelect = (region: RegionItem) => {
    onChange(region.key, region.value);
    onSearchOpenChange(false);
    setQuery('');
  };

  const handleClose = () => {
    onSearchOpenChange(false);
    setQuery('');
  };

  return (
    <>
      <button
        type="button"
        className="w-full text-left border-b border-border-default pb-2"
        onClick={() => onSearchOpenChange(true)}
      >
        <span
          className={cn(
            'typo-body-1-regular',
            value ? 'text-label-default' : 'text-label-placeholder',
          )}
        >
          {value ?? '지역을 검색해주세요'}
        </span>
      </button>

      <BottomSheet
        id="region-search-sheet"
        open={searchOpen}
        onClose={handleClose}
        hideHandle
        className="gap-0 pt-5"
      >
        <div className="px-1 pb-4 border-b border-border-default">
          <p className="typo-body-1-semibold text-label-default mb-3">지역 검색</p>
          <Input
            placeholder="지역 검색 (예: 강남구, 수원시)"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            autoFocus
          />
        </div>
        <div className="h-[55vh] overflow-y-auto -mx-6">
          {filtered.map((r) => (
            <button
              key={r.label}
              type="button"
              className="w-full text-left px-6 py-4 typo-body-1-regular text-label-default border-b border-border-default last:border-0 active:bg-alternative"
              onClick={() => handleSelect(r)}
            >
              {r.label}
            </button>
          ))}
          {filtered.length === 0 && (
            <p className="py-8 text-center typo-body-1-regular text-label-placeholder">
              검색 결과가 없습니다
            </p>
          )}
        </div>
      </BottomSheet>
    </>
  );
}
