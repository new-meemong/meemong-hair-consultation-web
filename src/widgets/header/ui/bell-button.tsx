'use client';

import React from 'react';
import BellIcon from '@/assets/icons/bell.svg';

interface BellButtonProps {
  onClick?: () => void;
}

export function BellButton({ onClick }: BellButtonProps) {
  const handleClick = () => {
    // 기본 동작 또는 전달된 onClick 함수 실행
    if (onClick) {
      onClick();
    } else {
      console.log('알림 버튼 클릭');
    }
  };

  return (
    <button onClick={handleClick} aria-label="알림">
      <BellIcon />
    </button>
  );
}
