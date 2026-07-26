'use client';

import type { ReactNode } from 'react';

import ChevronRightStrokeIcon from '@/assets/icons/meemong-chevron-right-stroke.svg';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';
import { cn } from '@/shared/lib/utils';
import { MeemongTypography } from '@/shared/styles/typography';

type MeemongTopBarProps = {
  title?: string;
  showBackButton?: boolean;
  reverse?: boolean;
  onBackClick?: () => void;
  rightComponent?: ReactNode;
  className?: string;
};

export function MeemongTopBar({
  title,
  showBackButton = true,
  reverse = false,
  onBackClick,
  rightComponent,
  className,
}: MeemongTopBarProps) {
  const router = useRouterWithUser();

  return (
    <header
      className={cn(
        'flex h-[50px] shrink-0 items-center justify-between px-0.5',
        reverse ? 'bg-brand-core text-icon-inverse' : 'bg-background-white text-text-primary',
        className,
      )}
    >
      <div className="flex size-11 shrink-0 items-center justify-center">
        {showBackButton && (
          <button
            type="button"
            onClick={onBackClick ?? router.back}
            className="flex size-11 items-center justify-center"
            aria-label="뒤로 가기"
          >
            <ChevronRightStrokeIcon className="h-[18px] w-[11px] rotate-180" />
          </button>
        )}
      </div>

      {title ? (
        <h1 className={cn('min-w-0 flex-1 truncate text-center', MeemongTypography.title1SemiBold)}>
          {title}
        </h1>
      ) : (
        <div className="min-w-0 flex-1" />
      )}

      <div className="flex size-11 shrink-0 items-center justify-center">{rightComponent}</div>
    </header>
  );
}
