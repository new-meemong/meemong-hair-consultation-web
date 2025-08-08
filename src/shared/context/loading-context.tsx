'use client';

import {
  useIsFetching,
  useIsMutating,
  type QueryMeta,
  type Query,
  type Mutation,
} from '@tanstack/react-query';
import type { ReactNode } from 'react';
import { createContext, useContext, useState } from 'react';
import { LoadingComponent } from '../ui/loading-component';

interface LoadingContextType {
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

const LoadingContext = createContext<LoadingContextType>({
  loading: false,
  setLoading: () => {},
});

function shouldSkipLoadingOverlay(meta: QueryMeta | undefined, operation: Query | Mutation) {
  return typeof meta?.skipLoadingOverlay === 'function'
    ? meta.skipLoadingOverlay(operation)
    : meta?.skipLoadingOverlay;
}

function GlobalLoadingOverlay({ loading }: { loading: boolean }) {
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

  const isLoading = loading || isFetching || isMutating;

  return <LoadingComponent.Page isLoading={isLoading} />;
}

export function LoadingProvider({ children }: { children: ReactNode }) {
  const [loading, setLoading] = useState(false);

  return (
    <LoadingContext.Provider value={{ loading, setLoading }}>
      {children}
      <GlobalLoadingOverlay loading={loading} />
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
