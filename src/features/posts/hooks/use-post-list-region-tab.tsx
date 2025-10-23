import { useCallback, useState } from 'react';

import LocationIcon from '@/assets/icons/location.svg';
import { ROUTES } from '@/shared';
import { useRouterWithUser } from '@/shared/hooks/use-router-with-user';

type RegionTab = {
  id: 'region';
  label: string;
  icon: React.ReactNode;
  pressed: boolean;
  onPressedChange: () => void;
};

export default function usePostListRegionTab(): RegionTab {
  const { push } = useRouterWithUser();

  const [pressed, setPressed] = useState(false);

  const onPressedChange = useCallback(() => {
    if (pressed) {
      return;
    }
    push(ROUTES.POSTS_SELECT_REGION);
  }, [pressed, push]);

  return {
    id: 'region',
    label: '지역',
    icon: <LocationIcon className="size-5 fill-label-sub" />,
    pressed,
    onPressedChange,
  };
}
