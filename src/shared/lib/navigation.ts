'use client';

import { useRouter } from 'next/navigation';

import { createNavigation } from './routes';

/**
 * 네비게이션 훅
 * 추후 앱 브릿지를 위한 래퍼 훅으로 사용될 예정
 * @returns 네비게이션 함수
 */
export const useNavigation = () => {
  const router = useRouter();
  return createNavigation(router.push);
};
