import '../styles/globals.css';

import { Suspense } from 'react';

import type { Metadata, Viewport } from 'next';

import Script from 'next/script';

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

export const viewport: Viewport = {
  width: 'device-width',
  viewportFit: 'cover',
  initialScale: 1,
  userScalable: false,
  maximumScale: 1.0,
  minimumScale: 1.0,
};

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
    <html lang="ko" style={{ backgroundColor: '#ffffff' }}>
      <body
        className={`${pretendard.variable} antialiased max-w-2xl mx-auto`}
        style={{ backgroundColor: '#ffffff' }}
      >
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
        <Script id="send-message-to-flutter" strategy="afterInteractive">
          {`
            function goAppRouter(path){
              if(window.GoAppRouter) {
                window.GoAppRouter.postMessage(JSON.stringify(path));
              } else {
                console.log("goAppRouter channel is not available.");
              }
            }

            window.goAppRouter = goAppRouter;

            function closeWebview(message) {
              if(window.GoBack) {
                window.GoBack.postMessage(JSON.stringify(message));
              } else {
               console.log("GoBack channel is not available.");}
            }

            window.closeWebview = closeWebview;

            function openChatChannel(message) {
              if(window.OpenChatChannel) {
                window.OpenChatChannel.postMessage(JSON.stringify(message));
              } else {
                console.log("OpenChatChannel channel is not available.");
              }
            }

            window.openChatChannel = openChatChannel;

            function externalLink(url){
              if(window.ExternalLink) {
                window.ExternalLink.postMessage(JSON.stringify(url));
              } else {
                console.log("ExternalLink channel is not available.");
              }
            }

            window.externalLink = externalLink;
          `}
        </Script>
      </body>
    </html>
  );
}
