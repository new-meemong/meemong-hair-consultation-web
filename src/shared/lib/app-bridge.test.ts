import { afterEach, describe, expect, it, vi } from 'vitest';

import {
  closeAppWebView,
  openChatChannelInApp,
  openExternalLinkInApp,
  openHairConsultationBillingInApp,
  openInAppWebView,
  registerHairConsultationBillingInApp,
  startChatChannelInApp,
} from './app-bridge';
import { ChatOriginEntrySource, ChatV2ChannelType, ChatV2PostType } from './chat-start-request';

type TestBridgeWindow = Window & {
  GoAppRouter?: {
    postMessage: (value: string) => void;
  };
  GoBack?: {
    postMessage: (value: string) => void;
  };
  goAppRouter?: (payload: string) => void;
  ExternalLink?: {
    postMessage: (value: string) => void;
  };
  OpenHairConsultationBilling?: {
    postMessage: (value: string) => void;
  };
  OpenChatChannel?: {
    postMessage: (value: string) => void;
  };
  StartChatChannel?: {
    postMessage: (value: string) => void;
  };
  startChatChannel?: (message: unknown) => void;
  externalLink?: (url: string) => void;
};

const bridgeWindow = window as TestBridgeWindow;

describe('openInAppWebView', () => {
  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'GoAppRouter');
    Reflect.deleteProperty(window, 'goAppRouter');
  });

  it('returns false when only the layout wrapper exists', () => {
    bridgeWindow.goAppRouter = vi.fn();

    expect(openInAppWebView('/hair-consultation/posts/1')).toBe(false);
    expect(bridgeWindow.goAppRouter).not.toHaveBeenCalled();
  });

  it('ignores options and uses the wrapper with a string path for backward compatibility', () => {
    const goAppRouter = vi.fn();
    const postMessage = vi.fn();

    bridgeWindow.goAppRouter = goAppRouter;
    bridgeWindow.GoAppRouter = { postMessage };

    expect(
      openInAppWebView('/hair-consultation/posts/1', {
        reloadOnReturn: false,
      }),
    ).toBe(true);
    expect(goAppRouter).toHaveBeenCalledWith('/hair-consultation/posts/1');
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('ignores options and falls back to the native channel with a string payload', () => {
    const postMessage = vi.fn();

    bridgeWindow.GoAppRouter = { postMessage };

    expect(
      openInAppWebView('/hair-consultation/experience-groups/1', {
        reloadOnReturn: false,
      }),
    ).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(
      JSON.stringify('/hair-consultation/experience-groups/1'),
    );
  });
});

describe('startChatChannelInApp', () => {
  const request = {
    channelType: ChatV2ChannelType.HAIR_CONSULTATION,
    postType: ChatV2PostType.HAIR_CONSULTATION,
    postId: '10',
    answerId: '42',
    targetUserId: '2',
    originEntrySource: ChatOriginEntrySource.HAIR_CONSULTATION_RESPONSE_DETAIL_DIRECT_CHAT,
    joinType: 'MODEL' as const,
    isMyHairConsultationPost: false,
  };

  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'StartChatChannel');
    Reflect.deleteProperty(bridgeWindow, 'startChatChannel');
  });

  it('returns false when only the layout wrapper exists', () => {
    bridgeWindow.startChatChannel = vi.fn();

    expect(startChatChannelInApp(request)).toBe(false);
    expect(bridgeWindow.startChatChannel).not.toHaveBeenCalled();
  });

  it('uses the wrapper when the native channel exists', () => {
    const startChatChannel = vi.fn();
    const postMessage = vi.fn();
    bridgeWindow.startChatChannel = startChatChannel;
    bridgeWindow.StartChatChannel = { postMessage };

    expect(startChatChannelInApp(request)).toBe(true);
    expect(startChatChannel).toHaveBeenCalledWith(request);
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('falls back to the native channel', () => {
    const postMessage = vi.fn();
    bridgeWindow.StartChatChannel = { postMessage };

    expect(startChatChannelInApp(request)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify(request));
  });
});

describe('openExternalLinkInApp', () => {
  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'ExternalLink');
    Reflect.deleteProperty(window, 'externalLink');
  });

  it('returns false when only the layout wrapper exists', () => {
    bridgeWindow.externalLink = vi.fn();

    expect(openExternalLinkInApp('https://naver.com')).toBe(false);
    expect(bridgeWindow.externalLink).not.toHaveBeenCalled();
  });

  it('uses the wrapper when the native channel exists', () => {
    const externalLink = vi.fn();
    const postMessage = vi.fn();

    bridgeWindow.externalLink = externalLink;
    bridgeWindow.ExternalLink = { postMessage };

    expect(openExternalLinkInApp('https://naver.com')).toBe(true);
    expect(externalLink).toHaveBeenCalledWith('https://naver.com');
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('falls back to the native channel', () => {
    const postMessage = vi.fn();

    bridgeWindow.ExternalLink = { postMessage };

    expect(openExternalLinkInApp('https://naver.com')).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify('https://naver.com'));
  });
});

describe('closeAppWebView', () => {
  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'GoBack');
    Reflect.deleteProperty(window, 'closeWebview');
  });

  it('returns false when only the layout wrapper exists', () => {
    bridgeWindow.closeWebview = vi.fn();

    expect(closeAppWebView()).toBe(false);
    expect(bridgeWindow.closeWebview).not.toHaveBeenCalled();
  });

  it('uses the wrapper when the native channel exists', () => {
    const closeWebview = vi.fn();
    const postMessage = vi.fn();

    bridgeWindow.closeWebview = closeWebview;
    bridgeWindow.GoBack = { postMessage };

    expect(closeAppWebView()).toBe(true);
    expect(closeWebview).toHaveBeenCalledWith('close');
    expect(postMessage).not.toHaveBeenCalled();
  });

  it('falls back to the native channel', () => {
    const postMessage = vi.fn();

    bridgeWindow.GoBack = { postMessage };

    expect(closeAppWebView()).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify('close'));
  });

  it('preserves a structured close target for the native route handler', () => {
    const postMessage = vi.fn();
    const message = { type: 'close', target: 'experienceGroupMyList' };

    bridgeWindow.GoBack = { postMessage };

    expect(closeAppWebView(message)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify(message));
  });

  it('returns false when no close bridge exists', () => {
    expect(closeAppWebView()).toBe(false);
  });
});

describe('openHairConsultationBillingInApp', () => {
  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'OpenHairConsultationBilling');
  });

  it('returns false when the native channel does not exist', () => {
    expect(
      openHairConsultationBillingInApp({
        type: 'VIEW_ANSWER',
        designerName: '지우',
        answerId: 42,
        targetPath: '/posts/10/consulting/42',
      }),
    ).toBe(false);
  });

  it('keeps the legacy chat billing request for old apps without StartChatChannel', () => {
    const postMessage = vi.fn();
    bridgeWindow.OpenHairConsultationBilling = { postMessage };
    const message = {
      type: 'START_CONSULTATION_CHAT' as const,
      designerName: '지우',
      receiverId: 2,
      postId: '10',
      answerId: '42',
      entrySource: 'CONSULTING_RESPONSE' as const,
      isMyHairConsultationPost: false as const,
    };

    expect(openHairConsultationBillingInApp(message)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify(message));
  });

  it('registers support for the native billing protocol', () => {
    const postMessage = vi.fn();
    bridgeWindow.OpenHairConsultationBilling = { postMessage };

    expect(registerHairConsultationBillingInApp()).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify({ type: 'REGISTER' }));
  });
});

describe('openChatChannelInApp', () => {
  afterEach(() => {
    Reflect.deleteProperty(bridgeWindow, 'OpenChatChannel');
  });

  it('sends the native access reason with the chat request', () => {
    const postMessage = vi.fn();
    bridgeWindow.OpenChatChannel = { postMessage };
    const message = {
      userId: '1',
      chatChannelId: 'hair_1_2',
      entrySource: 'CONSULTING_RESPONSE' as const,
      isMyHairConsultationPost: false,
      nativeAccessReason: 'EXISTING_CHAT' as const,
    };

    expect(openChatChannelInApp(message)).toBe(true);
    expect(postMessage).toHaveBeenCalledWith(JSON.stringify(message));
  });
});
