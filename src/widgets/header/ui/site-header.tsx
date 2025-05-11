'use client';

import React from 'react';
import BellIcon from '@/assets/icons/bell.svg';

interface SiteHeaderProps {
  title?: string;
}

export const SiteHeader = ({ title = '헤어 상담' }: SiteHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-5 border-b border-border-default">
      <h1 className="typo-title-2-semibold">{title}</h1>
      <button aria-label="알림">
        <BellIcon />
      </button>
    </header>
  );
};
