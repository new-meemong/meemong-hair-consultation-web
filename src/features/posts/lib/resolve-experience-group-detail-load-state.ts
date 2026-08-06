import { getApiError } from '@/shared/lib/error-handler';

export type ExperienceGroupDetailLoadState = 'loading' | 'ready' | 'notFound' | 'error';

type ResolveExperienceGroupDetailLoadStateParams = {
  isPending: boolean;
  isError: boolean;
  error: unknown;
  hasData: boolean;
};

export function resolveExperienceGroupDetailLoadState({
  isPending,
  isError,
  error,
  hasData,
}: ResolveExperienceGroupDetailLoadStateParams): ExperienceGroupDetailLoadState {
  if (isPending) return 'loading';
  if (hasData) return 'ready';
  if (isError && getApiError(error).httpCode === 404) return 'notFound';
  return 'error';
}
