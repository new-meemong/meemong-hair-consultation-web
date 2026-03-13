import { canSkipMongWithMeemongPass } from '@/features/ad-block/lib/meemong-pass-policy';
import useGetAdBlockStatus from '@/features/ad-block/api/use-get-ad-block-status';
import { useMemo } from 'react';

export default function useMeemongPassPolicy() {
  const { data: adBlockStatus } = useGetAdBlockStatus();

  const isMeemongPassActive = adBlockStatus?.data?.isActive === true;

  const policy = useMemo(
    () => ({
      isMeemongPassActive,
      canSkipMong: (createType: string) =>
        canSkipMongWithMeemongPass({
          isMeemongPassActive,
          createType,
        }),
    }),
    [isMeemongPassActive],
  );

  return policy;
}
