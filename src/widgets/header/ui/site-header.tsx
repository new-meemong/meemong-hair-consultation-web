'use client';

import React, { type ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import ChevronLeftIcon from '@/assets/icons/chevron-left.svg';

interface SiteHeaderProps {
  title?: string;
  showBackButton?: boolean;
  onBackClick?: () => void;
  rightComponent?: ReactNode;
}

export const SiteHeader = ({
  title = '헤어 상담',
  showBackButton = false,
  onBackClick,
  rightComponent,
}: SiteHeaderProps) => {
  const router = useRouter();

  const handleBackClick = () => {
    if (onBackClick) {
      onBackClick();
    } else {
      router.back();
    }
  };

  return (
    <header className="flex items-center border-b border-border-default p-5">
      {showBackButton ? (
        /* 백버튼이 있는 헤더 디자인 (가운데 정렬 제목) */
        <>
          <div className="flex-1">
            <button onClick={handleBackClick} aria-label="뒤로 가기">
              <ChevronLeftIcon className="h-6 w-6" />
            </button>
          </div>
          <h1 className="typo-title-3-semibold flex-1 text-center">{title}</h1>
          <div className="flex-1 flex justify-end">{rightComponent}</div>
        </>
      ) : (
        /* 메인 페이지 헤더 디자인 (좌측 정렬 제목) */
        <>
          <h1 className="typo-title-2-semibold flex-1">{title}</h1>
          <div className="flex-1 flex justify-end">{rightComponent}</div>
        </>
      )}
    </header>
  );
};
