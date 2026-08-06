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
  });

  it('keeps the legacy and typed response-detail sources for app-version compatibility', () => {
    goDesignerProfilePage('131224', {
      postId: '7434',
      answerId: '13902',
      entrySource: 'CONSULTING_RESPONSE',
      originEntrySource:
        ChatOriginEntrySource.HAIR_CONSULTATION_RESPONSE_DETAIL_DESIGNER_PROFILE_MENU_INQUIRY,
    });

    expect(openInAppWebView).toHaveBeenCalledWith(
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

    expect(openInAppWebView).toHaveBeenCalledWith(
      '/designer/profile/131224?from=hairConsultation&entrySource=POST_COMMENT&originEntrySource=HAIR_CONSULTATION_POST_COMMENT_DESIGNER_PROFILE_MENU_INQUIRY',
      { reloadOnReturn: false },
    );
  });
});
