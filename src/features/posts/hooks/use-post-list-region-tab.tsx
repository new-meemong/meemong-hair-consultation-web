import { useCallback } from 'react';

import LocationIcon from '@/assets/icons/location.svg';

import { ALL_OPTION } from '@/features/region/constants/region';
import useSelectedRegion from '@/features/region/hooks/use-selected-region';

import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

import { ROUTES } from '@/shared';

export default function usePostListRegionTab() {
  const { push } = useRouterWithUser();

  const { userSelectedRegionData, setSelectedRegionData } = useSelectedRegion();

  const selected = !!userSelectedRegionData;

  const onPressedChange = useCallback(() => {
    if (selected) {
      return;
    }
    push(ROUTES.POSTS_SELECT_REGION);
  }, [selected, push]);

  const getLabel = () => {
    if (userSelectedRegionData) {
      const values = userSelectedRegionData.values;
      const count = values.length;
      if (count === 1) {
        if (values[0] === ALL_OPTION) {
          return `${userSelectedRegionData.key} ${ALL_OPTION}`;
        }
        return values[0];
      }
      return `${values[0]} 외 ${count - 1}개`;
    }
    return '지역';
  };

  const handleDeleteSelectedRegion = () => {
    setSelectedRegionData(null);
  };

  const regionTab = {
    id: 'region',
    label: getLabel(),
    icon: userSelectedRegionData ? null : <LocationIcon className="size-5 fill-label-sub" />,
    onDelete: userSelectedRegionData ? handleDeleteSelectedRegion : undefined,
    pressed: selected,
    onPressedChange,
  };

  return { regionTab, userSelectedRegionData };
}
