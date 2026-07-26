import type { ComponentProps } from 'react';

import { cn } from '@/shared/lib/utils';
import { MeemongTypography } from '@/shared/styles/typography';

type MeemongButtonProps = ComponentProps<'button'> & {
  tone?: 'brand' | 'secondary';
};

export function MeemongButton({
  tone = 'brand',
  type = 'button',
  className,
  ...props
}: MeemongButtonProps) {
  return (
    <button
      type={type}
      className={cn(
        'inline-flex items-center justify-center whitespace-nowrap rounded-10 transition-colors disabled:pointer-events-none',
        'h-[52px] px-4',
        tone === 'brand'
          ? 'bg-brand-core text-icon-inverse disabled:bg-fill-disabled'
          : 'border border-border-regular bg-fill-white text-text-primary disabled:opacity-40',
        MeemongTypography.title2SemiBold,
        className,
      )}
      {...props}
    />
  );
}
