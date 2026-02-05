'use client';

import { Loader } from '@/shared/ui/loader';

interface LoadingOverlayProps {
  isLoading?: boolean;
}

function PageLoader({ isLoading = true }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="flex flex-col items-center p-2 bg-label-default rounded-10">
        <Loader theme="light" size="md" />
      </div>
    </div>
  );
}

function ShortLoader({ isLoading = true }: LoadingOverlayProps) {
  if (!isLoading) return null;

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Loader size="sm" theme="short" />
    </div>
  );
}

export const LoadingComponent = Object.assign(PageLoader, { Page: PageLoader, Short: ShortLoader });
