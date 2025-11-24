import { useQuery } from '@tanstack/react-query';

import type { Banner } from '@/entities/banner/model/banner';
import { USER_ROLE } from '@/entities/user/constants/user-role';
import { apiClientWithoutAuth } from '@/shared/api/client';
import type { ValueOf } from '@/shared/type/types';

const getGetBannerEndpoint = () => 'banners';
export const getGetBannerQueryKeyPrefix = () => getGetBannerEndpoint();

type GetBannersQueryParams = {
  userType: ValueOf<typeof USER_ROLE>;
  bannerType: '번개매칭' | '일반' | '구인구직' | '바텀시트' | '채팅배너' | '지도로보기';
};

function getUserType(userType: ValueOf<typeof USER_ROLE>) {
  return userType === USER_ROLE.DESIGNER ? '디자이너' : '모델';
}

export default function useGetBanner(params: GetBannersQueryParams) {
  const { userType, bannerType } = params;

  return useQuery({
    queryKey: [getGetBannerQueryKeyPrefix(), params],
    queryFn: () =>
      apiClientWithoutAuth.getList<Banner>(getGetBannerEndpoint(), {
        searchParams: {
          userType: getUserType(userType),
          bannerType,
        },
      }),
  });
}
