import { beforeEach, describe, expect, it, vi } from 'vitest';

import { ChatOriginEntrySource } from './chat-start-request';

const { openInAppWebView } = vi.hoisted(() => ({
  openInAppWebView: vi.fn(),
}));

vi.mock('./app-bridge', () => ({
  openInAppWebView,
}));

import { goDesignerProfilePage } from './go-designer-profile-page';

describe('goDesignerProfilePage', () => {
  beforeEach(() => {
    openInAppWebView.mockReset();
    window.history.replaceState({}, '', '/');
  });

  it.each([
    ['/', 'hair_consultation'],
    ['/?chatEntry=model_home_consultation', 'model_home_consultation'],
  ])('uses one advisor section and a direct step from %s', (location, entry) => {
    window.history.replaceState({}, '', location);
    goDesignerProfilePage('131224', {
      entrySource: 'TOP_ADVISOR', isTopAdvisorDesigner: true,
    });
    const [path, options] = openInAppWebView.mock.calls.at(-1)!;
    const url = new URL(path, 'https://example.test');
    const journey = JSON.parse(url.searchParams.get('chatJourney')!);
    expect([journey.entry, journey.section, ...journey.steps].join('>'))
      .toBe(`${entry}>top_advisor>direct>designer_profile`);
    expect(journey.targetId).toBe('131224');
    expect(url.searchParams.get('entrySource')).toBe('TOP_ADVISOR');
    expect(url.searchParams.get('isTopAdvisorDesigner')).toBe('true');
    expect(options).toEqual({ reloadOnReturn: false });
  });

  it('keeps the legacy and typed response-detail sources for app-version compatibility', () => {
    goDesignerProfilePage('131224', {
      postId: '7434',
      answerId: '13902',
      entrySource: 'CONSULTING_RESPONSE',
      originEntrySource:
        ChatOriginEntrySource.HAIR_CONSULTATION_RESPONSE_DETAIL_DESIGNER_PROFILE_MENU_INQUIRY,
    });

    expectNavigation(
      '/designer/profile/131224?from=hairConsultation&postId=7434&answerId=13902&entrySource=CONSULTING_RESPONSE&originEntrySource=HAIR_CONSULTATION_RESPONSE_DETAIL_DESIGNER_PROFILE_MENU_INQUIRY',
      { reloadOnReturn: false },
    );
  });

  it('keeps the post-comment menu-inquiry origin distinct from direct hair chat', () => {
    goDesignerProfilePage('131224', {
      entrySource: 'POST_COMMENT',
      originEntrySource:
        ChatOriginEntrySource.HAIR_CONSULTATION_POST_COMMENT_DESIGNER_PROFILE_MENU_INQUIRY,
    });

    expectNavigation(
      '/designer/profile/131224?from=hairConsultation&entrySource=POST_COMMENT&originEntrySource=HAIR_CONSULTATION_POST_COMMENT_DESIGNER_PROFILE_MENU_INQUIRY',
      { reloadOnReturn: false },
    );
  });
});

function expectNavigation(expected: string, options: { reloadOnReturn: boolean }) {
  const [actual, actualOptions] = vi.mocked(openInAppWebView).mock.calls.at(-1)!;
  const url = new URL(actual, 'https://example.test');
  const journey = JSON.parse(url.searchParams.get('chatJourney')!);
  expect(journey.entry).toBe('hair_consultation');
  expect(journey.steps.at(-1)).toBe('designer_profile');
  expect(journey.targetId).toBe(url.pathname.split('/').at(-1));
  url.searchParams.delete('chatJourney');
  expect(url.pathname + url.search).toBe(expected);
  expect(actualOptions).toEqual(options);
}
