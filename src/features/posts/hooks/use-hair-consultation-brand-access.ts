import { useMemo } from 'react';

import { useGetBrandIdMap } from '@/entities/brands/api/use-get-brand-id-map';
import { useOptionalAuthContext } from '@/features/auth/context/auth-context';

import useGetHairConsultationDetail from '../api/use-get-hair-consultation-detail';

export default function useHairConsultationBrandAccess(postId: string) {
  const auth = useOptionalAuthContext();
  const isUserDesigner = auth?.isUserDesigner ?? false;
  const myBrandId = auth?.user.brand?.id ?? null;
  const { data } = useGetHairConsultationDetail(postId);
  const brandIdMap = useGetBrandIdMap();

  return useMemo(() => {
    const detail = data?.data;
    const postBrandIds = Array.from(
      new Set(detail?.brandIds ?? detail?.brands?.map((brand) => brand.id) ?? []),
    );
    const postBrandName = postBrandIds.map((id) => brandIdMap.get(id)).find(Boolean) ?? '브랜드';
    const isBrandRestrictedPost = postBrandIds.length > 0;
    const isMatchedBrandDesigner =
      isUserDesigner && myBrandId != null && postBrandIds.includes(myBrandId);

    return {
      postBrandIds,
      postBrandName,
      isBrandRestrictedPost,
      isDesignerBlockedFromBrandPost:
        isUserDesigner && isBrandRestrictedPost && !isMatchedBrandDesigner,
    };
  }, [brandIdMap, data?.data, isUserDesigner, myBrandId]);
}
