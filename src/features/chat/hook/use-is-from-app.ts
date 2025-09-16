import { useSearchParams } from 'next/navigation';

import { SEARCH_PARAMS } from '@/shared/constants/search-params';

export default function useIsFromApp() {
  const searchParams = useSearchParams();
  const isFromApp = searchParams.get(SEARCH_PARAMS.SOURCE) === 'app';
  return isFromApp;
}
