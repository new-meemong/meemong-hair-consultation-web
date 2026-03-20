import { type ReactNode, Suspense } from 'react';

import { AuthProvider } from '@/features/auth/context/auth-context';
import { LoadingProvider } from '@/shared/context/loading-context';

// 웹뷰 전용 레이아웃 — userId 기반 인증(AuthProvider)을 여기에 격리
// (web)/[brandSlug]/** 는 이 레이아웃을 통과하지 않음 → userId 없이 접근 가능
export default function WebviewLayout({ children }: { children: ReactNode }) {
  return (
    <Suspense fallback={<div />}>
      <AuthProvider>
        <LoadingProvider>{children}</LoadingProvider>
      </AuthProvider>
    </Suspense>
  );
}
