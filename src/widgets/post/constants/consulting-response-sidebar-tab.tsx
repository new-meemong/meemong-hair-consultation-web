import GalleryIcon from '@/assets/icons/gallery.svg';
import StarIcon from '@/assets/icons/star.svg';
import ArticleIcon from '@/assets/icons/article.svg';
import ConsultingResponseSidebarCurrentStateTabView from '../ui/consulting-response-sidebar-current-state-tab-view';
import ConsultingResponseSidebarDesiredStyleTabView from '../ui/consulting-response-sidebar-desired-style-tab-view';
import ConsultingResponseSidebarAdditionalInfoTabView from '../ui/consulting-response-sidebar-additional-info-tab-view';

export const CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE = {
  CURRENT_STATE: 'currentState',
  DESIRED_STYLE: 'desiredStyle',
  ADDITIONAL_INFO: 'additionalInfo',
} as const;

export const CONSULTING_RESPONSE_SIDEBAR_TAB = {
  [CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.CURRENT_STATE]: {
    label: '현재 상태',
    value: CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.CURRENT_STATE,
    icon: <GalleryIcon className="size-4 fill-label-info group-data-[state=on]:fill-white" />,
    component: <ConsultingResponseSidebarCurrentStateTabView />,
  },
  [CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.DESIRED_STYLE]: {
    label: '추구미',
    value: CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.DESIRED_STYLE,
    icon: <StarIcon className="size-4 fill-label-info group-data-[state=on]:fill-white" />,
    component: <ConsultingResponseSidebarDesiredStyleTabView />,
  },
  [CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ADDITIONAL_INFO]: {
    label: '추가 정보',
    value: CONSULTING_RESPONSE_SIDEBAR_TAB_VALUE.ADDITIONAL_INFO,
    icon: <ArticleIcon className="size-4 fill-label-info group-data-[state=on]:fill-white" />,
    component: <ConsultingResponseSidebarAdditionalInfoTabView />,
  },
} as const;

export const CONSULTING_RESPONSE_SIDEBAR_TABS = Object.values(CONSULTING_RESPONSE_SIDEBAR_TAB);
