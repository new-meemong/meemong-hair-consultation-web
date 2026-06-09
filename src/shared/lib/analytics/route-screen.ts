import type { AnalyticsScreenInfo } from './types';

type RouteMatcher = {
  pattern: RegExp;
  screenName: string;
  screenPathTemplate: string;
};

const routeMatchers: RouteMatcher[] = [
  {
    pattern: /^\/$/,
    screenName: 'hair_consultation_root',
    screenPathTemplate: '/',
  },
  {
    pattern: /^\/welcome$/,
    screenName: 'hair_consultation_welcome',
    screenPathTemplate: '/welcome',
  },
  {
    pattern: /^\/report$/,
    screenName: 'hair_consultation_report',
    screenPathTemplate: '/report',
  },
  {
    pattern: /^\/posts$/,
    screenName: 'hair_consultation_posts',
    screenPathTemplate: '/posts',
  },
  {
    pattern: /^\/posts\/select-region$/,
    screenName: 'hair_consultation_select_region',
    screenPathTemplate: '/posts/select-region',
  },
  {
    pattern: /^\/posts\/create$/,
    screenName: 'hair_consultation_post_create',
    screenPathTemplate: '/posts/create',
  },
  {
    pattern: /^\/posts\/create\/hair-length$/,
    screenName: 'hair_consultation_create_hair_length',
    screenPathTemplate: '/posts/create/hair-length',
  },
  {
    pattern: /^\/posts\/create\/hair-texture$/,
    screenName: 'hair_consultation_create_hair_texture',
    screenPathTemplate: '/posts/create/hair-texture',
  },
  {
    pattern: /^\/posts\/create\/skin-brightness$/,
    screenName: 'hair_consultation_create_skin_brightness',
    screenPathTemplate: '/posts/create/skin-brightness',
  },
  {
    pattern: /^\/posts\/create\/personal-color$/,
    screenName: 'hair_consultation_create_personal_color',
    screenPathTemplate: '/posts/create/personal-color',
  },
  {
    pattern: /^\/posts\/create\/hair-concerns$/,
    screenName: 'hair_consultation_create_hair_concerns',
    screenPathTemplate: '/posts/create/hair-concerns',
  },
  {
    pattern: /^\/posts\/new\/[^/]+$/,
    screenName: 'hair_consultation_post_new',
    screenPathTemplate: '/posts/new/:postingId',
  },
  {
    pattern: /^\/posts\/experience-groups\/[^/]+$/,
    screenName: 'hair_consultation_experience_group_detail',
    screenPathTemplate: '/posts/experience-groups/:id',
  },
  {
    pattern: /^\/posts\/experience-groups\/[^/]+\/edit$/,
    screenName: 'hair_consultation_experience_group_edit',
    screenPathTemplate: '/posts/experience-groups/:id/edit',
  },
  {
    pattern: /^\/posts\/[^/]+\/consulting\/create$/,
    screenName: 'hair_consultation_response_create',
    screenPathTemplate: '/posts/:postId/consulting/create',
  },
  {
    pattern: /^\/posts\/[^/]+\/consulting\/[^/]+$/,
    screenName: 'hair_consultation_response_detail',
    screenPathTemplate: '/posts/:postId/consulting/:responseId',
  },
  {
    pattern: /^\/posts\/[^/]+$/,
    screenName: 'hair_consultation_post_detail',
    screenPathTemplate: '/posts/:postId',
  },
  {
    pattern: /^\/chat\/hair-consultation$/,
    screenName: 'hair_consultation_chat_list',
    screenPathTemplate: '/chat/hair-consultation',
  },
  {
    pattern: /^\/chat\/hair-consultation\/[^/]+$/,
    screenName: 'hair_consultation_chat_detail',
    screenPathTemplate: '/chat/hair-consultation/:id',
  },
  {
    pattern: /^\/[^/]+$/,
    screenName: 'hair_consultation_brand_home',
    screenPathTemplate: '/:brandSlug',
  },
  {
    pattern: /^\/[^/]+\/welcome$/,
    screenName: 'hair_consultation_brand_welcome',
    screenPathTemplate: '/:brandSlug/welcome',
  },
  {
    pattern: /^\/[^/]+\/my$/,
    screenName: 'hair_consultation_brand_my',
    screenPathTemplate: '/:brandSlug/my',
  },
  {
    pattern: /^\/[^/]+\/my\/posts\/[^/]+$/,
    screenName: 'hair_consultation_brand_my_post_detail',
    screenPathTemplate: '/:brandSlug/my/posts/:postId',
  },
  {
    pattern: /^\/[^/]+\/sample$/,
    screenName: 'hair_consultation_brand_sample',
    screenPathTemplate: '/:brandSlug/sample',
  },
  {
    pattern: /^\/[^/]+\/posts$/,
    screenName: 'hair_consultation_brand_posts',
    screenPathTemplate: '/:brandSlug/posts',
  },
  {
    pattern: /^\/[^/]+\/posts\/create$/,
    screenName: 'hair_consultation_brand_post_create',
    screenPathTemplate: '/:brandSlug/posts/create',
  },
  {
    pattern: /^\/[^/]+\/posts\/create\/complete$/,
    screenName: 'hair_consultation_brand_post_complete',
    screenPathTemplate: '/:brandSlug/posts/create/complete',
  },
  {
    pattern: /^\/[^/]+\/posts\/create\/[^/]+$/,
    screenName: 'hair_consultation_brand_post_create_step',
    screenPathTemplate: '/:brandSlug/posts/create/:step',
  },
  {
    pattern: /^\/[^/]+\/posts\/[^/]+$/,
    screenName: 'hair_consultation_brand_post_detail',
    screenPathTemplate: '/:brandSlug/posts/:postId',
  },
  {
    pattern: /^\/[^/]+\/auth\/link$/,
    screenName: 'hair_consultation_brand_auth_link',
    screenPathTemplate: '/:brandSlug/auth/link',
  },
  {
    pattern: /^\/[^/]+\/auth\/phone$/,
    screenName: 'hair_consultation_brand_auth_phone',
    screenPathTemplate: '/:brandSlug/auth/phone',
  },
  {
    pattern: /^\/[^/]+\/auth\/signup$/,
    screenName: 'hair_consultation_brand_auth_signup',
    screenPathTemplate: '/:brandSlug/auth/signup',
  },
  {
    pattern: /^\/[^/]+\/auth\/signup\/region$/,
    screenName: 'hair_consultation_brand_auth_region',
    screenPathTemplate: '/:brandSlug/auth/signup/region',
  },
  {
    pattern: /^\/[^/]+\/auth\/signup\/terms$/,
    screenName: 'hair_consultation_brand_auth_terms',
    screenPathTemplate: '/:brandSlug/auth/signup/terms',
  },
];

export function resolveAnalyticsScreen(pathname: string): AnalyticsScreenInfo {
  const normalizedPathname = normalizePathname(pathname);
  const matcher = routeMatchers.find((routeMatcher) =>
    routeMatcher.pattern.test(normalizedPathname),
  );

  if (matcher) {
    return {
      screenName: matcher.screenName,
      screenPathTemplate: matcher.screenPathTemplate,
    };
  }

  const screenPathTemplate = normalizeDynamicRouteTemplate(normalizedPathname);

  return {
    screenName: `hair_consultation_${screenPathTemplate
      .replace(/:[^/]+/g, 'detail')
      .replace(/[^a-zA-Z0-9]+/g, '_')
      .replace(/^_+|_+$/g, '')
      .toLowerCase()}`,
    screenPathTemplate,
  };
}

function normalizePathname(pathname: string): string {
  if (!pathname || pathname === '/') return '/';

  return pathname.replace(/\/+$/, '') || '/';
}

function normalizeDynamicRouteTemplate(pathname: string): string {
  if (pathname === '/') return '/';

  const segments = pathname.split('/').filter(Boolean);

  return `/${segments
    .map((segment, index) => {
      if (index === 0 && !isKnownRootSegment(segment)) {
        return ':brandSlug';
      }

      if (/^\d+$/.test(segment)) {
        return ':id';
      }

      if (/^[0-9a-fA-F-]{16,}$/.test(segment)) {
        return ':id';
      }

      return segment;
    })
    .join('/')}`;
}

function isKnownRootSegment(segment: string): boolean {
  return segment === 'posts' || segment === 'chat' || segment === 'welcome' || segment === 'report';
}
