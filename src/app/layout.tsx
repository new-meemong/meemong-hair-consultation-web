import '../styles/globals.css';

import { Suspense } from 'react';

import type { Metadata } from 'next';

import localFont from 'next/font/local';

import { AuthProvider } from '@/features/auth/context/auth-context';
import { LoadingProvider } from '@/shared/context/loading-context';
import { OverlayProvider } from '@/shared/context/overlay-context';
import { ErrorBoundary } from '@/shared/error-boundary';
import { QueryProvider } from '@/shared/ui/providers/query-provider';

const pretendard = localFont({
  src: '../fonts/PretendardVariable.woff2',
  display: 'swap',
  weight: '45 920',
  variable: '--font-pretendard',
});

export const metadata: Metadata = {
  title: 'Meemong',
  description: 'Meemong project',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="ko">
      <body className={`${pretendard.variable} antialiased max-w-2xl mx-auto`}>
        <OverlayProvider>
          <QueryProvider>
            <ErrorBoundary>
              <Suspense fallback={<div />}>
                <AuthProvider>
                  <LoadingProvider>{children}</LoadingProvider>
                </AuthProvider>
              </Suspense>
            </ErrorBoundary>
          </QueryProvider>
        </OverlayProvider>
      </body>
    </html>
  );
}
