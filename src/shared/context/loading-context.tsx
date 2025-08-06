'use client';

import type { ReactNode } from 'react';
import { createContext, useContext } from 'react';

import {
  useIsFetching,
  useIsMutating,
  type QueryMeta,
  type Query,
  type Mutation,
} from '@tanstack/react-query';

import { LoadingComponent } from '../ui/loading-component';

const LoadingContext = createContext<null>(null);

function shouldSkipLoadingOverlay(meta: QueryMeta | undefined, operation: Query | Mutation) {
  return typeof meta?.skipLoadingOverlay === 'function'
    ? meta.skipLoadingOverlay(operation)
    : meta?.skipLoadingOverlay;
}

function GlobalLoadingOverlay() {
  const isFetching = !!useIsFetching({
    predicate: (query) => {
      const meta = query.meta as QueryMeta | undefined;
      return !shouldSkipLoadingOverlay(meta, query);
    },
  });

  const isMutating = !!useIsMutating({
    predicate: (mutation) => {
      const meta = mutation.meta as QueryMeta | undefined;
      return !shouldSkipLoadingOverlay(meta, mutation);
    },
  });

  const isLoading = isFetching || isMutating;

  return <LoadingComponent.Page isLoading={isLoading} />;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  return (
    <LoadingContext.Provider value={null}>
      {children}
      <GlobalLoadingOverlay />
    </LoadingContext.Provider>
  );
}

export function useLoadingContext() {
  const context = useContext(LoadingContext);
  if (!context) {
    throw new Error('useLoading must be used within a LoadingProvider');
  }
  return context;
}
