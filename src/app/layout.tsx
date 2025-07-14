import { AuthProvider } from '@/shared/context/auth-context';
import { LoadingProvider } from '@/shared/context/loading-context';
import { OverlayProvider } from '@/shared/context/overlay-context';
import { QueryProvider } from '@/shared/ui/providers/query-provider';
import type { Metadata } from 'next';
import localFont from 'next/font/local';
import { Suspense } from 'react';
import '../styles/globals.css';

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
        <QueryProvider>
          <Suspense fallback={<div>suspense</div>}>
            <AuthProvider>
              <OverlayProvider>
                <LoadingProvider>{children}</LoadingProvider>
              </OverlayProvider>
            </AuthProvider>
          </Suspense>
        </QueryProvider>
      </body>
    </html>
  );
}
