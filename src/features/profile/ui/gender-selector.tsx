'use client';

import { cn } from '@/shared/lib/utils';

export type Gender = 'FEMALE' | 'MALE';

type GenderSelectorProps = {
  value: Gender | null;
  onChange: (gender: Gender) => void;
};

export function GenderSelector({ value, onChange }: GenderSelectorProps) {
  return (
    <div className="flex flex-col gap-3">
      {(['FEMALE', 'MALE'] as Gender[]).map((gender) => (
        <button
          key={gender}
          type="button"
          onClick={() => onChange(gender)}
          className={cn(
            'w-full py-4 rounded-[4px] typo-body-1-medium border',
            value === gender
              ? 'bg-label-default text-white border-label-default'
              : 'bg-white text-label-default border-border-default',
          )}
        >
          {gender === 'FEMALE' ? '여성' : '남성'}
        </button>
      ))}
    </div>
  );
}
